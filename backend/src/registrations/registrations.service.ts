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
  constructor(private prisma: PrismaService) { }

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

    const existingRegistration = await this.prisma.registration.findFirst({
      where: {
        userId,
        eventId: createRegistrationInput.eventId,
        status: {
          in: [
            RegistrationStatus.CONFIRMED,
            RegistrationStatus.PENDING,

          ],
        },
      },
      include: {
        event: {
          select: { title: true },
        },
      },
    });

    if (existingRegistration) {
      console.warn(
        `⚠️ User ${userId} already has registration ${existingRegistration.id} for event ${createRegistrationInput.eventId} with status ${existingRegistration.status}`,
      );

      // Return more specific error messages based on status
      switch (existingRegistration.status) {
        case RegistrationStatus.CONFIRMED:
          throw new ConflictException(
            `You are already confirmed for "${existingRegistration.event.title}". Check your registrations for details.`,
          );
        case RegistrationStatus.PENDING:
          throw new ConflictException(
            `You have a pending registration for "${existingRegistration.event.title}". Please complete your registration or contact support.`,
          );

        default:
          throw new ConflictException(
            `You already have an active registration for "${existingRegistration.event.title}".`,
          );
      }
    }

    // Get event details to check capacity and pricing
    const event = await this.prisma.event.findUnique({
      where: { id: createRegistrationInput.eventId },
      include: {
        registrations: {
          where: {
            status: {
              in: [RegistrationStatus.CONFIRMED, RegistrationStatus.PENDING],
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

    // Count current confirmed registrations (excluding waitlist)
    const confirmedRegistrations = event.registrations.length;
    const isEventFull = confirmedRegistrations >= event.maxParticipants;

    // Determine registration type and status
    let registrationType =
      createRegistrationInput.registrationType || RegistrationType.REGULAR;
    let status = RegistrationStatus.PENDING;

    if (isEventFull) {
      throw new BadRequestException('Event is full');
    }

    // Calculate pricing
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    let amountDue = 0;
    let paymentRequired = false;

    if (event.type !== 'FREE') {
      // Use member price if user has valid ESN card, otherwise regular price
      amountDue =
        user?.esnCardVerified && event.memberPrice
          ? event.memberPrice
          : event.price || 0;
      paymentRequired = amountDue > 0;
    }

    // Calculate position for waitlist
    let position: number | null = null;

    try {
      // Create the registration with enhanced error handling
      const registration = await this.prisma.registration.create({
        data: {
          userId,
          eventId: createRegistrationInput.eventId,
          status,
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
        },
        include: {
          event: {
            select: {
              id: true,
              title: true,
              startDate: true,
              location: true,
              price: true,
              memberPrice: true,
              type: true,
            },
          },
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      });

      console.log(
        `✅ Registration created successfully: ${registration.id} for user ${userId} on event ${createRegistrationInput.eventId}`,
      );

      return registration;
    } catch (error) {
      // Handle Prisma unique constraint errors more gracefully
      if (
        error.code === 'P2002' &&
        error.meta?.target?.includes('userId') &&
        error.meta?.target?.includes('eventId')
      ) {
        console.error(
          '🔥 Unique constraint violation caught at creation time:',
          error,
        );
        throw new ConflictException(
          'You are already registered for this event. If you believe this is an error, please refresh the page and try again.',
        );
      }

      console.error('❌ Registration creation failed:', error);
      throw error;
    }
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



    const registrationCount = confirmedRegistrations.length;


    // For registration context, we know this user is now registered
    const isRegistered = true;
    const canRegister = false; // User just registered, so they can't register again

    console.log(
      `📊 Transform Event for Registration ${event.title}: registrationCount=${registrationCount}`,
    );

    return {
      ...event,
      registrationCount,

      isRegistered,
      canRegister,
    };
  }
}