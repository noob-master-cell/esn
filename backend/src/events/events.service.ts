import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from './../../prisma/prisma.service';
import { CreateEventInput } from './dto/create-event.input';
import { UpdateEventInput } from './dto/update-event.input';
import { EventsFilterInput } from './dto/events-filter.input';
import { EventStatus } from './entities/event.entity';
import { UserRole } from '@prisma/client'; // ← FIXED: Import from Prisma instead

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  async create(createEventInput: CreateEventInput, organizerId: string) {
    console.log('🎪 Events Service: Creating event:', createEventInput.title);

    // Validate dates
    if (createEventInput.endDate <= createEventInput.startDate) {
      throw new BadRequestException('End date must be after start date');
    }

    if (
      createEventInput.registrationDeadline &&
      createEventInput.registrationDeadline >= createEventInput.startDate
    ) {
      throw new BadRequestException(
        'Registration deadline must be before event start date',
      );
    }

    const event = await this.prisma.event.create({
      data: {
        ...createEventInput,
        organizerId,
        status: EventStatus.DRAFT,
      },
      include: {
        organizer: true,
        registrations: {
          include: { user: true },
        },
      },
    });

    console.log('✅ Events Service: Event created:', event.id);
    return this.transformEvent(event);
  }

  async findAll(filter: EventsFilterInput, userId?: string) {
    console.log('📋 Events Service: Finding events with filter:', filter);

    const where: any = {};

    // Search functionality
    if (filter.search) {
      where.OR = [
        { title: { contains: filter.search, mode: 'insensitive' } },
        { description: { contains: filter.search, mode: 'insensitive' } },
        { location: { contains: filter.search, mode: 'insensitive' } },
      ];
    }

    // Filters
    if (filter.category) where.category = filter.category;
    if (filter.type) where.type = filter.type;
    if (filter.status) where.status = filter.status;
    if (filter.location)
      where.location = { contains: filter.location, mode: 'insensitive' };

    // Date filters
    if (filter.startDate || filter.endDate) {
      where.startDate = {};
      if (filter.startDate) where.startDate.gte = filter.startDate;
      if (filter.endDate) where.startDate.lte = filter.endDate;
    }

    // Available spots filter
    if (filter.availableOnly) {
      where.registrations = {
        _count: {
          lt: where.maxParticipants || 999999,
        },
      };
    }

    // Only show published events to regular users
    if (!userId) {
      where.status = EventStatus.PUBLISHED;
      where.isPublic = true;
    }

    const orderBy: any = {};
    orderBy[filter.orderBy || 'startDate'] = filter.orderDirection || 'asc';

    const events = await this.prisma.event.findMany({
      where,
      include: {
        organizer: true,
        registrations: {
          include: { user: true },
        },
      },
      orderBy,
      skip: filter.skip || 0,
      take: filter.take || 20,
    });

    console.log(`✅ Events Service: Found ${events.length} events`);
    return events.map((event) => this.transformEvent(event));
  }

  async findOne(id: string, userId?: string) {
    console.log('🔍 Events Service: Finding event:', id);

    const event = await this.prisma.event.findUnique({
      where: { id },
      include: {
        organizer: true,
        registrations: {
          include: { user: true },
        },
      },
    });

    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    // Check if user can view this event
    if (!event.isPublic && event.status !== EventStatus.PUBLISHED) {
      if (!userId || event.organizerId !== userId) {
        throw new ForbiddenException(
          'You do not have permission to view this event',
        );
      }
    }

    console.log('✅ Events Service: Event found:', event.title);
    return this.transformEvent(event, userId);
  }

  async update(
    id: string,
    updateEventInput: UpdateEventInput,
    userId: string,
    userRole: UserRole,
  ) {
    console.log('🔄 Events Service: Updating event:', id);

    const event = await this.findOne(id, userId);

    // Check permissions
    if (userRole !== UserRole.ADMIN && event.organizerId !== userId) {
      throw new ForbiddenException('You can only update your own events');
    }

    // Validate dates if being updated
    if (updateEventInput.endDate && updateEventInput.startDate) {
      if (updateEventInput.endDate <= updateEventInput.startDate) {
        throw new BadRequestException('End date must be after start date');
      }
    }

    const updatedEvent = await this.prisma.event.update({
      where: { id },
      data: updateEventInput,
      include: {
        organizer: true,
        registrations: {
          include: { user: true },
        },
      },
    });

    console.log('✅ Events Service: Event updated:', updatedEvent.title);
    return this.transformEvent(updatedEvent);
  }

  async remove(id: string, userId: string, userRole: UserRole) {
    console.log('🗑️ Events Service: Deleting event:', id);

    const eventData = await this.prisma.event.findUnique({
      where: { id },
      include: {
        organizer: true,
        registrations: true,
      },
    });

    if (!eventData) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    // Check permissions
    if (userRole !== UserRole.ADMIN && eventData.organizerId !== userId) {
      throw new ForbiddenException('You can only delete your own events');
    }

    // Check if event has registrations
    if (eventData.registrations.length > 0) {
      throw new BadRequestException(
        'Cannot delete event with registered participants',
      );
    }

    await this.prisma.event.delete({
      where: { id },
    });

    console.log('✅ Events Service: Event deleted');
    return true;
  }

  async publish(id: string, userId: string, userRole: UserRole) {
    console.log('📢 Events Service: Publishing event:', id);

    const event = await this.findOne(id, userId);

    // Check permissions
    if (userRole !== UserRole.ADMIN && event.organizerId !== userId) {
      throw new ForbiddenException('You can only publish your own events');
    }

    if (event.status !== EventStatus.DRAFT) {
      throw new BadRequestException('Only draft events can be published');
    }

    const publishedEvent = await this.prisma.event.update({
      where: { id },
      data: { status: EventStatus.PUBLISHED },
      include: {
        organizer: true,
        registrations: {
          include: { user: true },
        },
      },
    });

    console.log('✅ Events Service: Event published:', publishedEvent.title);
    return this.transformEvent(publishedEvent);
  }

  async getMyEvents(userId: string) {
    console.log('👤 Events Service: Getting user events:', userId);

    const events = await this.prisma.event.findMany({
      where: { organizerId: userId },
      include: {
        organizer: true,
        registrations: {
          include: { user: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    console.log(`✅ Events Service: Found ${events.length} user events`);
    return events.map((event) => this.transformEvent(event));
  }

  // Helper method to transform prisma event to GraphQL event
  private transformEvent(event: any, userId?: string) {
    const registrationCount = event.registrations?.length || 0;
    const waitlistCount = 0; // TODO: Implement waitlist logic

    return {
      ...event,
      registrationCount,
      waitlistCount,
      isRegistered: userId
        ? event.registrations?.some((reg: any) => reg.userId === userId)
        : false,
      canRegister: registrationCount < event.maxParticipants,
    };
  }
}