import { Injectable, NotFoundException, ForbiddenException, BadRequestException, Inject, OnModuleInit } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventInput } from './dto/create-event.input';
import { UpdateEventInput } from './dto/update-event.input';
import { EventsFilterInput } from './dto/events-filter.input';
import { EventStatus, UserRole, RegistrationStatus } from '@prisma/client';
import { PaginatedEvents } from './dto/paginated-events.output';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class EventsService implements OnModuleInit {
  constructor(
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private cloudinaryService: CloudinaryService,
  ) { }

  onModuleInit() {
    // Check for completed events every hour
    setInterval(() => {
      this.checkEventStatus();
    }, 3600000); // 1 hour

    // Run immediately on startup
    this.checkEventStatus();
  }

  async checkEventStatus() {
    try {
      const now = new Date();

      // Find events that have ended but are not marked as COMPLETED or CANCELLED
      const eventsToComplete = await this.prisma.event.findMany({
        where: {
          endDate: { lt: now },
          status: {
            notIn: [EventStatus.COMPLETED, EventStatus.CANCELLED],
          },
        },
        select: { id: true, title: true },
      });

      if (eventsToComplete.length > 0) {
        console.log(`Found ${eventsToComplete.length} events to mark as COMPLETED`);

        await this.prisma.event.updateMany({
          where: {
            id: { in: eventsToComplete.map(e => e.id) },
          },
          data: {
            status: EventStatus.COMPLETED,
          },
        });

        // Invalidate cache
        // Invalidate cache
        await this.clearEventsCache();

        console.log(`Marked ${eventsToComplete.length} events as COMPLETED`);
      }
    } catch (error) {
      console.error('Error checking event status:', error);
    }
  }

  async create(createEventInput: CreateEventInput, organizerId: string) {


    // Validate dates
    if (createEventInput.endDate <= createEventInput.startDate) {
      throw new BadRequestException('End date must be after start date');
    }

    // Validate registration deadline
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
      },
      include: {
        organizer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            avatar: true,
          },
        },
        registrations: {
          where: {
            status: {
              not: RegistrationStatus.CANCELLED,
            },
          },
          take: 100,
          select: {
            id: true,
            status: true,
            userId: true,
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatar: true,
              },
            },
          },
        },
      },
    });

    // Invalidate events cache
    // Invalidate events cache
    await this.clearEventsCache();


    return this.transformEvent(event);
  }

  async findAll(filter: EventsFilterInput = {}, userId?: string, userRole?: UserRole): Promise<PaginatedEvents> {
    // Cache key based on filter and user (to handle personalized fields like isRegistered)
    const cacheKey = `events_all_${JSON.stringify(filter)}_${userId || 'public'}`;

    // Try to get from cache (skip for admins to ensure fresh data)
    if (userRole !== UserRole.ADMIN) {
      const cached = await this.cacheManager.get<PaginatedEvents>(cacheKey);
      if (cached) {
        return cached;
      }
    }


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

    // Only show published/active events to regular users (not drafts or cancelled)
    // Unless the user is an ADMIN
    if (userRole !== UserRole.ADMIN) {
      where.status = EventStatus.PUBLISHED;
      where.isPublic = true;
    }

    const orderBy: any = {};
    orderBy[filter.orderBy || 'startDate'] = filter.orderDirection || 'asc';

    const [items, total] = await Promise.all([
      this.prisma.event.findMany({
        where,
        include: {
          organizer: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              avatar: true,
            },
          },
          registrations: {
            where: {
              status: {
                not: RegistrationStatus.CANCELLED,
              },
            },
            take: 100, // Limit registrations per event
            select: {
              id: true,
              status: true,
              userId: true,
              user: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  avatar: true,
                },
              },
            },
          },
        },
        orderBy,
        skip: filter.skip || 0,
        take: Math.min(filter.take || 20, 100), // Cap at 100 records max
      }),
      this.prisma.event.count({ where }),
    ]);


    const result = {
      items: items.map((event) => this.transformEvent(event, userId)),
      total,
    };

    // Cache for 5 minutes (300000 ms) - skip for admins
    if (userRole !== UserRole.ADMIN) {
      await this.cacheManager.set(cacheKey, result, 300000);
    }

    return result;
  }

  async findOne(id: string, userId?: string) {


    const event = await this.prisma.event.findUnique({
      where: { id },
      include: {
        organizer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            avatar: true,
          },
        },
        registrations: {
          where: {
            status: {
              not: RegistrationStatus.CANCELLED,
            },
          },
          take: 100,
          select: {
            id: true,
            status: true,
            userId: true,
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatar: true,
              },
            },
          },
        },
      },
    });

    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    // Check if user can view this event
    const isDraftOrCancelled = event.status === EventStatus.DRAFT || event.status === EventStatus.CANCELLED;
    if (!event.isPublic || isDraftOrCancelled) {
      if (!userId || event.organizerId !== userId) {
        throw new ForbiddenException(
          'You do not have permission to view this event',
        );
      }
    }


    return this.transformEvent(event, userId);
  }

  async update(
    id: string,
    updateEventInput: UpdateEventInput,
    userId: string,
    userRole: UserRole,
  ) {


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

    // Exclude id from update data
    const { id: inputId, ...updateData } = updateEventInput;

    const updatedEvent = await this.prisma.event.update({
      where: { id },
      data: updateData,
      include: {
        organizer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            avatar: true,
          },
        },
        registrations: {
          where: {
            status: {
              not: RegistrationStatus.CANCELLED,
            },
          },
          take: 100,
          select: {
            id: true,
            status: true,
            userId: true,
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatar: true,
              },
            },
          },
        },
      },
    });

    // Invalidate events cache
    // Invalidate events cache
    await this.clearEventsCache();

    // Cloudinary Cleanup: Delete images that were removed
    if (updateData.images) {
      const oldImages = event.images || [];
      const newImages = updateData.images;

      // Find images that are in oldImages but NOT in newImages
      const imagesToDelete = oldImages.filter(img => !newImages.includes(img));

      for (const imageUrl of imagesToDelete) {
        const publicId = this.cloudinaryService.extractPublicIdFromUrl(imageUrl);
        if (publicId) {
          // Fire and forget - don't await to avoid slowing down the response
          this.cloudinaryService.deleteImage(publicId).catch(err =>
            console.error(`Failed to delete image ${publicId}:`, err)
          );
        }
      }
    }

    return this.transformEvent(updatedEvent);
  }

  async remove(id: string, userId: string, userRole: UserRole) {


    const eventData = await this.prisma.event.findUnique({
      where: { id },
      include: {
        organizer: true,
        registrations: {
          where: {
            status: {
              not: RegistrationStatus.CANCELLED,
            },
          },
        },
      },
    });

    if (!eventData) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    // Check permissions
    if (userRole !== UserRole.ADMIN && eventData.organizerId !== userId) {
      throw new ForbiddenException('You can only delete your own events');
    }

    // For non-admin users, prevent deletion if there are active registrations
    if (userRole !== UserRole.ADMIN && eventData.registrations.length > 0) {
      throw new BadRequestException(
        'Cannot delete event with registered participants. Please cancel all registrations first.',
      );
    }

    // For admins, allow deletion but cascade delete registrations
    if (userRole === UserRole.ADMIN && eventData.registrations.length > 0) {

      // Delete all registrations for this event first
      await this.prisma.registration.deleteMany({
        where: { eventId: id },
      });

    }

    // Cloudinary Cleanup: Delete all event images
    if (eventData.images && eventData.images.length > 0) {
      for (const imageUrl of eventData.images) {
        const publicId = this.cloudinaryService.extractPublicIdFromUrl(imageUrl);
        if (publicId) {
          this.cloudinaryService.deleteImage(publicId).catch(err =>
            console.error(`Failed to delete image ${publicId}:`, err)
          );
        }
      }
    }

    await this.prisma.event.delete({
      where: { id },
    });

    // Invalidate events cache
    // Invalidate events cache
    await this.clearEventsCache();

    return true;
  }

  async publish(id: string, userId: string, userRole: UserRole) {


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
          where: {
            status: {
              not: RegistrationStatus.CANCELLED,
            },
          },
          include: { user: true },
        },
      },
    });


    return this.transformEvent(publishedEvent);
  }

  async getMyEvents(userId: string) {


    const events = await this.prisma.event.findMany({
      where: { organizerId: userId },
      include: {
        organizer: true,
        registrations: {
          where: {
            status: {
              not: RegistrationStatus.CANCELLED,
            },
          },
          include: { user: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });


    return events.map((event) => this.transformEvent(event));
  }

  // Helper method to transform prisma event to GraphQL event
  private transformEvent(event: any, userId?: string) {
    // Safely get registrations array - ensure it's always an array
    const registrations = Array.isArray(event.registrations)
      ? event.registrations
      : [];

    // Filter active registrations (not cancelled)
    const activeRegistrations = registrations.filter(
      (reg: any) => reg.status !== RegistrationStatus.CANCELLED,
    );

    // Count confirmed/pending registrations
    const confirmedRegistrations = activeRegistrations.filter(
      (reg: any) =>
        reg.status === RegistrationStatus.CONFIRMED ||
        reg.status === RegistrationStatus.PENDING ||
        reg.status === RegistrationStatus.ATTENDED ||
        reg.status === RegistrationStatus.NO_SHOW,
    );

    const attendees = confirmedRegistrations.map((reg: any) => reg.user);



    const registrationCount = confirmedRegistrations.length;


    // Check if current user is registered
    const isRegistered = userId
      ? activeRegistrations.some((reg: any) => reg.userId === userId)
      : false;

    // Compute derived status
    let status = event.status;
    const now = new Date();
    const startDate = new Date(event.startDate);
    const endDate = new Date(event.endDate);
    const registrationDeadline = event.registrationDeadline ? new Date(event.registrationDeadline) : startDate;

    if (event.status === EventStatus.PUBLISHED) {
      if (now > endDate) {
        status = EventStatus.COMPLETED;
      } else if (now > startDate) {
        status = EventStatus.ONGOING; // Event started, registration closed
      } else if (registrationCount >= event.maxParticipants || now > registrationDeadline) {
        status = EventStatus.REGISTRATION_CLOSED;
      } else {
        status = EventStatus.REGISTRATION_OPEN;
      }
    }

    // Check if user can register (spots available and not already registered and registration is open)
    const canRegister =
      !isRegistered &&
      status === EventStatus.REGISTRATION_OPEN;

    return {
      ...event,
      status,
      registrationCount,

      isRegistered,
      canRegister,
      attendees,
    };
  }


  public computeEventStatus(event: any, registrationCount: number): string {
    if (event.status !== EventStatus.PUBLISHED) {
      return event.status;
    }

    const now = new Date();
    const startDate = new Date(event.startDate);
    const endDate = new Date(event.endDate);
    const registrationDeadline = event.registrationDeadline ? new Date(event.registrationDeadline) : startDate;

    if (now > endDate) {
      return EventStatus.COMPLETED;
    } else if (now > startDate) {
      return EventStatus.ONGOING;
    } else if (registrationCount >= event.maxParticipants || now > registrationDeadline) {
      return EventStatus.REGISTRATION_CLOSED;
    } else {
      return EventStatus.REGISTRATION_OPEN;
    }
  }

  async countRegistrations(eventId: string, status: RegistrationStatus | RegistrationStatus[]) {
    const statusFilter = Array.isArray(status) ? { in: status } : status;
    return this.prisma.registration.count({
      where: {
        eventId,
        status: statusFilter,
      },
    });
  }

  private async clearEventsCache() {
    try {
      // Access the underlying store to get keys (Redis specific)
      const store = (this.cacheManager as any).store;
      if (store.keys) {
        const keys = await store.keys('events_all_*');
        if (keys && keys.length > 0) {
          // Delete keys individually or in bulk depending on store support
          // cache-manager v5+ usually supports mdel or we loop
          if (store.mdel) {
            await store.mdel(...keys);
          } else {
            await Promise.all(keys.map((key: string) => this.cacheManager.del(key)));
          }
          console.log(`Cleared ${keys.length} event cache keys`);
        }
      }
    } catch (error) {
      console.error('Failed to clear events cache:', error);
    }
  }
}