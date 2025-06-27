// backend/src/registrations/registrations.resolver.ts
import { Resolver, Query, Mutation, Args, ID, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { RegistrationsService } from './registrations.service';
import {
  Registration,
  RegistrationStatus,
} from './entities/registration.entity'; // Add RegistrationStatus import
import { CreateRegistrationInput } from './dto/create-registration.input';
import { UpdateRegistrationInput } from './dto/update-registration.input';
import { RegistrationFilterInput } from './dto/registration-filter.input';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { UserRole } from '@prisma/client';

@Resolver(() => Registration)
export class RegistrationsResolver {
  constructor(private readonly registrationsService: RegistrationsService) {}

  @Mutation(() => Registration)
  @UseGuards(JwtAuthGuard)
  async registerForEvent(
    @Args('createRegistrationInput')
    createRegistrationInput: CreateRegistrationInput,
    @CurrentUser() user: User,
  ) {
    console.log(
      '🎫 Registration Resolver: Register for event mutation called by:',
      user.email,
    );
    return this.registrationsService.create(createRegistrationInput, user.id);
  }

  @Query(() => [Registration], { name: 'registrations' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.ORGANIZER)
  async findAllRegistrations(
    @Args('filter', { nullable: true }) filter: RegistrationFilterInput = {},
    @CurrentUser() user: User,
  ) {
    console.log(
      '📋 Registration Resolver: Find all registrations query by:',
      user.email,
    );
    return this.registrationsService.findAll(filter, user.id, user.role);
  }

  @Query(() => [Registration], { name: 'myRegistrations' })
  @UseGuards(JwtAuthGuard)
  async findMyRegistrations(@CurrentUser() user: User) {
    console.log(
      '👤 Registration Resolver: Find my registrations query for:',
      user.email,
    );
    return this.registrationsService.getMyRegistrations(user.id);
  }

  @Query(() => [Registration], { name: 'eventRegistrations' })
  @UseGuards(JwtAuthGuard)
  async findEventRegistrations(
    @Args('eventId', { type: () => ID }) eventId: string,
    @Args('filter', { nullable: true }) filter: RegistrationFilterInput = {},
    @CurrentUser() user: User,
  ) {
    console.log(
      '🎪 Registration Resolver: Find event registrations query for event:',
      eventId,
    );

    // Add eventId to filter
    const eventFilter = { ...filter, eventId };

    return this.registrationsService.findAll(eventFilter, user.id, user.role);
  }

  @Query(() => Registration, { name: 'registration' })
  @UseGuards(JwtAuthGuard)
  async findOneRegistration(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() user: User,
  ) {
    console.log('🔍 Registration Resolver: Find one registration query:', id);
    return this.registrationsService.findOne(id, user.id, user.role);
  }

  @Mutation(() => Registration)
  @UseGuards(JwtAuthGuard)
  async updateRegistration(
    @Args('updateRegistrationInput')
    updateRegistrationInput: UpdateRegistrationInput,
    @CurrentUser() user: User,
  ) {
    console.log(
      '🔄 Registration Resolver: Update registration mutation called by:',
      user.email,
    );
    return this.registrationsService.update(
      updateRegistrationInput.id,
      updateRegistrationInput,
      user.id,
      user.role,
    );
  }

  @Mutation(() => Registration)
  @UseGuards(JwtAuthGuard)
  async cancelRegistration(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() user: User,
  ) {
    console.log(
      '❌ Registration Resolver: Cancel registration mutation called by:',
      user.email,
    );
    return this.registrationsService.cancel(id, user.id, user.role);
  }

  @Query(() => Int, { name: 'registrationsCount' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.ORGANIZER)
  async getRegistrationsCount(
    @Args('filter', { nullable: true }) filter: RegistrationFilterInput = {},
    @CurrentUser() user: User,
  ) {
    console.log('🔢 Registration Resolver: Get registrations count query');
    const registrations = await this.registrationsService.findAll(
      filter,
      user.id,
      user.role,
    );
    return registrations.length;
  }

  @Query(() => Int, { name: 'eventCapacityInfo' })
  async getEventCapacityInfo(
    @Args('eventId', { type: () => ID }) eventId: string,
  ) {
    console.log(
      '📊 Registration Resolver: Get event capacity info for:',
      eventId,
    );

    const filter = { eventId, status: RegistrationStatus.CONFIRMED }; // Fix: Use enum instead of string
    const confirmedRegistrations =
      await this.registrationsService.findAll(filter);

    return {
      confirmedCount: confirmedRegistrations.length,
      // Additional capacity info can be added here
    };
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.ORGANIZER)
  async markAttendance(
    @Args('registrationId', { type: () => ID }) registrationId: string,
    @Args('attended', { type: () => Boolean }) attended: boolean,
    @CurrentUser() user: User,
  ) {
    console.log(
      '✅ Registration Resolver: Mark attendance for registration:',
      registrationId,
    );

    const status = attended
      ? RegistrationStatus.ATTENDED
      : RegistrationStatus.NO_SHOW; // Fix: Use enum values

    await this.registrationsService.update(
      registrationId,
      { id: registrationId, status },
      user.id,
      user.role,
    );

    return true;
  }

  @Query(() => [Registration], { name: 'waitlistRegistrations' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.ORGANIZER)
  async findWaitlistRegistrations(
    @Args('eventId', { type: () => ID }) eventId: string,
    @CurrentUser() user: User,
  ) {
    console.log(
      '⏳ Registration Resolver: Find waitlist registrations for event:',
      eventId,
    );

    const filter = {
      eventId,
      status: RegistrationStatus.WAITLISTED, // Fix: Use enum instead of string
      orderBy: 'position',
      orderDirection: 'asc' as const,
    };

    return this.registrationsService.findAll(filter, user.id, user.role);
  }

  @Mutation(() => Registration)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.ORGANIZER)
  async promoteFromWaitlist(
    @Args('registrationId', { type: () => ID }) registrationId: string,
    @CurrentUser() user: User,
  ) {
    console.log(
      '🔄 Registration Resolver: Promote from waitlist:',
      registrationId,
    );

    return this.registrationsService.update(
      registrationId,
      {
        id: registrationId,
        status: RegistrationStatus.CONFIRMED, // Fix: Use enum instead of string
      },
      user.id,
      user.role,
    );
  }
}
