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
import { UserRole, EventStatus } from '@prisma/client';

@Injectable()
export class RegistrationsService {
  constructor(private prisma: PrismaService) {}

  async create(
    createRegistrationInput: CreateRegistrationInput,
    userId: string,
  ) {
    console.log(
      '🎫 Registration Service: Creating registration for user:',
      userId,
      'event:',
      createRegistrationInput.eventId,
    );

    // Check if user already has an active registration for this event
    const existingRegistration = await this.prisma.registration.findFirst({
      where: {
        userId,
        eventId: createRegistrationInput.eventId,
        status: {
          not: RegistrationStatus.CANCELLED,
        },
      },
    });

    if (existingRegistration) {
      throw new BadRequestException(
        'You are already registered for this event',
      );
    }

    // Get event details to check capacity and pricing
    const event = await this.prisma.event.findUnique({
      where: { id: createRegistrationInput.eventId },
      include: {
        registrations: {
          where: {
            status: {
              not: RegistrationStatus.CANCELLED,
            },
          },
        },
      },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    // Check if event is published and registration is open
    if (event.status !== EventStatus.PUBLISHED) {
      throw new BadRequestException('Event is not open for registration');
    }

    // Check registration deadline
    if (event.registrationDeadline && new Date() > event.registrationDeadline) {
      throw new BadRequestException('Registration deadline has passed');
    }

    // Count current confirmed registrations
    const confirmedRegistrations = event.registrations.filter(
      (reg) =>
        reg.status === RegistrationStatus.CONFIRMED ||
        reg.status === RegistrationStatus.PENDING,
    );

    const isEventFull = confirmedRegistrations.length >= event.maxParticipants;

    // Determine registration type and status
    let registrationType =
      createRegistrationInput.registrationType || RegistrationType.REGULAR;
    let status = RegistrationStatus.PENDING;

    if (isEventFull) {
      if (!event.allowWaitlist) {
        throw new BadRequestException(
          'Event is full and waitlist is not allowed',
        );
      }
      registrationType = RegistrationType.WAITLIST;
      status = RegistrationStatus.WAITLISTED;
    } else {
      // For regular registrations, check if payment is required
      if (event.price && event.price > 0) {
        status = RegistrationStatus.PENDING; // Will need payment confirmation
      } else {
        status = RegistrationStatus.CONFIRMED; // Free events auto-confirm
      }
    }

    // Calculate position for waitlisted registrations
    let position: number | null = null;
    if (status === RegistrationStatus.WAITLISTED) {
      const waitlistCount = await this.prisma.registration.count({
        where: {
          eventId: createRegistrationInput.eventId,
          status: RegistrationStatus.WAITLISTED,
        },
      });
      position = waitlistCount + 1;
    }

    // Calculate amount due
    let amountDue = 0;
    if (
      event.price &&
      event.price > 0 &&
      status !== RegistrationStatus.WAITLISTED
    ) {
      // TODO: Check if user has ESN card for member pricing
      amountDue = event.price;
    }

    // Create the registration
    const registration = await this.prisma.registration.create({
      data: {
        userId,
        eventId: createRegistrationInput.eventId,
        status,
        registrationType,
        position,
        paymentRequired: amountDue > 0,
        amountDue,
        currency: 'EUR',
        specialRequests: createRegistrationInput.specialRequests,
        dietary: createRegistrationInput.dietary,
        emergencyContact: createRegistrationInput.emergencyContact,
        registeredAt: new Date(),
        confirmedAt:
          status === RegistrationStatus.CONFIRMED ? new Date() : null,
      },
      include: {
        user: true,
        event: {
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
        },
      },
    });

    console.log(
      '✅ Registration Service: Registration created successfully:',
      registration.id,
      'Status:',
      registration.status,
      'Type:',
      registration.registrationType,
    );

    // Transform the registration with updated event counts
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
        status: {
          not: RegistrationStatus.CANCELLED,
        },
      },
      include: {
        user: true,
        event: {
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
        },
      },
      orderBy: { registeredAt: 'desc' },
    });

    console.log(
      `✅ Registration Service: Found ${registrations.length} user registrations`,
    );

    return registrations.map((registration) => {
      const transformedReg = this.transformRegistration(registration);
      console.log(
        `🔍 Transformed registration for event: ${transformedReg.event?.title}, registrationCount: ${transformedReg.event?.registrationCount}`,
      );
      return transformedReg;
    });
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

  // Update the transformRegistration method
  private transformRegistration(registration: any) {
    return {
      ...registration,
      amountDue: parseFloat(registration.amountDue.toString()),
      event: this.transformEventForRegistration(registration.event),
    };
  }

  // Enhanced event transformation for registration context
  private transformEventForRegistration(event: any) {
    if (!event) return null;

    // Safely get registrations array
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
        reg.status === RegistrationStatus.PENDING,
    );

    // Count waitlisted registrations
    const waitlistedRegistrations = activeRegistrations.filter(
      (reg: any) => reg.status === RegistrationStatus.WAITLISTED,
    );

    const registrationCount = confirmedRegistrations.length;
    const waitlistCount = waitlistedRegistrations.length;

    // For registration context, we know this user is now registered
    const isRegistered = true;
    const canRegister = false; // User just registered, so they can't register again

    console.log(
      `📊 Transform Event for Registration ${event.title}: registrationCount=${registrationCount}, waitlistCount=${waitlistCount}`,
    );

    return {
      ...event,
      registrationCount,
      waitlistCount,
      isRegistered,
      canRegister,
    };
  }
}