// backend/src/registrations/registrations.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateRegistrationInput } from './dto/create-registration.input';
import { UpdateRegistrationInput } from './dto/update-registration.input';
import { RegistrationFilterInput } from './dto/registration-filter.input';
import {
  RegistrationStatus,
  RegistrationType,
  PaymentStatus,
} from './entities/registration.entity';
import { UserRole } from '@prisma/client';

@Injectable()
export class RegistrationsService {
  constructor(private prisma: PrismaService) {}

  async create(
    createRegistrationInput: CreateRegistrationInput,
    userId: string,
  ) {
    console.log(
      '🎫 Registration Service: Creating registration for event:',
      createRegistrationInput.eventId,
    );

    // Check if event exists and is active
    const event = await this.prisma.event.findUnique({
      where: { id: createRegistrationInput.eventId },
      include: {
        registrations: {
          where: { status: { not: RegistrationStatus.CANCELLED } },
        },
      },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    if (event.status !== 'PUBLISHED') {
      throw new BadRequestException('Event is not available for registration');
    }

    // Check if registration deadline has passed
    if (event.registrationDeadline && new Date() > event.registrationDeadline) {
      throw new BadRequestException('Registration deadline has passed');
    }

    // Check if user is already registered
    const existingRegistration = await this.prisma.registration.findUnique({
      where: {
        userId_eventId: {
          userId,
          eventId: createRegistrationInput.eventId,
        },
      },
    });

    if (existingRegistration) {
      throw new ConflictException('You are already registered for this event');
    }

    // Calculate current registrations (excluding cancelled)
    const currentRegistrations = event.registrations.length;
    const isEventFull = currentRegistrations >= event.maxParticipants;

    // Determine registration type and status
    let registrationType = RegistrationType.REGULAR;
    let registrationStatus = RegistrationStatus.PENDING;
    let position: number | null = null;

    if (isEventFull) {
      if (!event.allowWaitlist) {
        throw new BadRequestException(
          'Event is full and waitlist is not allowed',
        );
      }
      registrationType = RegistrationType.WAITLIST;
      registrationStatus = RegistrationStatus.WAITLISTED;

      // Calculate waitlist position
      const waitlistCount = await this.prisma.registration.count({
        where: {
          eventId: createRegistrationInput.eventId,
          registrationType: RegistrationType.WAITLIST,
          status: RegistrationStatus.WAITLISTED,
        },
      });
      position = waitlistCount + 1;
    } else {
      registrationStatus = RegistrationStatus.CONFIRMED;
    }

    // Calculate payment details
    const paymentRequired = (event.price || 0) > 0;
    let amountDue = event.price || 0;

    // Apply ESN card discount if user has verified ESN card
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (user?.esnCardVerified && event.memberPrice !== null) {
      amountDue = event.memberPrice || 0;
    }

    // Create registration
    const registration = await this.prisma.registration.create({
      data: {
        userId,
        eventId: createRegistrationInput.eventId,
        status: registrationStatus,
        registrationType,
        position,
        paymentRequired,
        paymentStatus: paymentRequired
          ? PaymentStatus.PENDING
          : PaymentStatus.COMPLETED,
        amountDue,
        currency: 'EUR',
        specialRequests: createRegistrationInput.specialRequests,
        emergencyContact: createRegistrationInput.emergencyContact,
        dietary: createRegistrationInput.dietary,
        registeredAt: new Date(),
        confirmedAt:
          registrationStatus === RegistrationStatus.CONFIRMED
            ? new Date()
            : null,
      },
      include: {
        user: true,
        event: true,
      },
    });

    console.log(
      '✅ Registration Service: Registration created successfully:',
      registration.id,
    );
    return this.transformRegistration(registration);
  }

  async findAll(
    filter: RegistrationFilterInput,
    requestingUserId?: string,
    userRole?: UserRole,
  ) {
    console.log(
      '📋 Registration Service: Finding registrations with filter:',
      filter,
    );

    const where: any = {};

    // Apply filters
    if (filter.status) where.status = filter.status;
    if (filter.registrationType)
      where.registrationType = filter.registrationType;
    if (filter.paymentStatus) where.paymentStatus = filter.paymentStatus;
    if (filter.eventId) where.eventId = filter.eventId;
    if (filter.userId) where.userId = filter.userId;

    // Date range filters
    if (filter.registeredAfter || filter.registeredBefore) {
      where.registeredAt = {};
      if (filter.registeredAfter)
        where.registeredAt.gte = filter.registeredAfter;
      if (filter.registeredBefore)
        where.registeredAt.lte = filter.registeredBefore;
    }

    // Privacy: Regular users can only see their own registrations
    if (userRole === UserRole.USER && requestingUserId) {
      where.userId = requestingUserId;
    }

    const orderBy: any = {};
    orderBy[filter.orderBy || 'registeredAt'] = filter.orderDirection || 'desc';

    const registrations = await this.prisma.registration.findMany({
      where,
      include: {
        user: true,
        event: true,
      },
      orderBy,
      skip: filter.skip || 0,
      take: filter.take || 20,
    });

    console.log(
      `✅ Registration Service: Found ${registrations.length} registrations`,
    );
    return registrations.map((registration) =>
      this.transformRegistration(registration),
    );
  }

  async findOne(id: string, requestingUserId?: string, userRole?: UserRole) {
    console.log('🔍 Registration Service: Finding registration:', id);

    const registration = await this.prisma.registration.findUnique({
      where: { id },
      include: {
        user: true,
        event: true,
      },
    });

    if (!registration) {
      throw new NotFoundException(`Registration with ID ${id} not found`);
    }

    // Privacy check: Users can only view their own registrations unless admin/organizer
    if (
      userRole === UserRole.USER &&
      requestingUserId &&
      registration.userId !== requestingUserId
    ) {
      throw new ForbiddenException('You can only view your own registrations');
    }

    console.log(
      '✅ Registration Service: Registration found:',
      registration.id,
    );
    return this.transformRegistration(registration);
  }

  async update(
    id: string,
    updateRegistrationInput: UpdateRegistrationInput,
    requestingUserId: string,
    userRole: UserRole,
  ) {
    console.log('🔄 Registration Service: Updating registration:', id);

    const registration = await this.findOne(id, requestingUserId, userRole);

    // Permission check: Users can only update their own registrations (limited fields)
    // Admins and organizers can update any registration
    if (
      userRole === UserRole.USER &&
      registration.userId !== requestingUserId
    ) {
      throw new ForbiddenException(
        'You can only update your own registrations',
      );
    }

    // Restrict what regular users can update
    const updateData: any = {};

    if (userRole === UserRole.USER) {
      // Users can only update their personal information
      if (updateRegistrationInput.specialRequests !== undefined) {
        updateData.specialRequests = updateRegistrationInput.specialRequests;
      }
      if (updateRegistrationInput.dietary !== undefined) {
        updateData.dietary = updateRegistrationInput.dietary;
      }
      if (updateRegistrationInput.emergencyContact !== undefined) {
        updateData.emergencyContact = updateRegistrationInput.emergencyContact;
      }
    } else {
      // Admins and organizers can update status and all fields
      Object.assign(updateData, updateRegistrationInput);

      // Handle status changes
      if (updateRegistrationInput.status) {
        updateData.status = updateRegistrationInput.status;

        if (updateRegistrationInput.status === RegistrationStatus.CONFIRMED) {
          updateData.confirmedAt = new Date();
        } else if (
          updateRegistrationInput.status === RegistrationStatus.CANCELLED
        ) {
          updateData.cancelledAt = new Date();
        }
      }
    }

    const updatedRegistration = await this.prisma.registration.update({
      where: { id },
      data: updateData,
      include: {
        user: true,
        event: true,
      },
    });

    console.log(
      '✅ Registration Service: Registration updated:',
      updatedRegistration.id,
    );
    return this.transformRegistration(updatedRegistration);
  }

  async cancel(id: string, requestingUserId: string, userRole: UserRole) {
    console.log('❌ Registration Service: Cancelling registration:', id);

    const registration = await this.findOne(id, requestingUserId, userRole);

    // Check if cancellation is allowed
    if (registration.status === RegistrationStatus.CANCELLED) {
      throw new BadRequestException('Registration is already cancelled');
    }

    if (registration.status === RegistrationStatus.ATTENDED) {
      throw new BadRequestException(
        'Cannot cancel registration for completed event',
      );
    }

    // Cancel the registration
    const cancelledRegistration = await this.prisma.registration.update({
      where: { id },
      data: {
        status: RegistrationStatus.CANCELLED,
        cancelledAt: new Date(),
      },
      include: {
        user: true,
        event: true,
      },
    });

    // If this was a confirmed registration, try to promote someone from waitlist
    if (registration.status === RegistrationStatus.CONFIRMED) {
      await this.promoteFromWaitlist(registration.eventId);
    }

    console.log(
      '✅ Registration Service: Registration cancelled:',
      cancelledRegistration.id,
    );
    return this.transformRegistration(cancelledRegistration);
  }

  async getMyRegistrations(userId: string) {
    console.log('👤 Registration Service: Getting user registrations:', userId);

    const registrations = await this.prisma.registration.findMany({
      where: {
        userId,
        status: { not: RegistrationStatus.CANCELLED },
      },
      include: {
        user: true,
        event: true,
      },
      orderBy: { registeredAt: 'desc' },
    });

    console.log(
      `✅ Registration Service: Found ${registrations.length} user registrations`,
    );
    return registrations.map((registration) =>
      this.transformRegistration(registration),
    );
  }

  // Helper method to promote someone from waitlist when a spot opens up
  private async promoteFromWaitlist(eventId: string) {
    console.log(
      '🔄 Registration Service: Promoting from waitlist for event:',
      eventId,
    );

    const nextInWaitlist = await this.prisma.registration.findFirst({
      where: {
        eventId,
        status: RegistrationStatus.WAITLISTED,
        registrationType: RegistrationType.WAITLIST,
      },
      orderBy: { position: 'asc' },
    });

    if (nextInWaitlist) {
      await this.prisma.registration.update({
        where: { id: nextInWaitlist.id },
        data: {
          status: RegistrationStatus.CONFIRMED,
          registrationType: RegistrationType.REGULAR,
          position: null,
          confirmedAt: new Date(),
        },
      });

      // Update positions for remaining waitlist
      await this.updateWaitlistPositions(eventId);

      console.log(
        '✅ Registration Service: Promoted user from waitlist:',
        nextInWaitlist.userId,
      );
    }
  }

  // Helper method to update waitlist positions
  private async updateWaitlistPositions(eventId: string) {
    const waitlistRegistrations = await this.prisma.registration.findMany({
      where: {
        eventId,
        status: RegistrationStatus.WAITLISTED,
        registrationType: RegistrationType.WAITLIST,
      },
      orderBy: { registeredAt: 'asc' },
    });

    for (let i = 0; i < waitlistRegistrations.length; i++) {
      await this.prisma.registration.update({
        where: { id: waitlistRegistrations[i].id },
        data: { position: i + 1 },
      });
    }
  }

  // Helper method to transform prisma registration to GraphQL registration
  private transformRegistration(registration: any) {
    return {
      ...registration,
      amountDue: parseFloat(registration.amountDue.toString()),
    };
  }
}
