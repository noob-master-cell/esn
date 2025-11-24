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
import { Auth0Guard } from '../auth/guards/auth0.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { UserRole } from '@prisma/client';

@Resolver(() => Registration)
export class RegistrationsResolver {
  constructor(private readonly registrationsService: RegistrationsService) { }

  @Mutation(() => Registration)
  @UseGuards(Auth0Guard)
  async registerForEvent(
    @Args('createRegistrationInput')
    createRegistrationInput: CreateRegistrationInput,
    @CurrentUser() user: User,
  ) {

    return this.registrationsService.create(createRegistrationInput, user.id);
  }

  @Query(() => [Registration], { name: 'registrations' })
  @UseGuards(Auth0Guard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async findAllRegistrations(
    @Args('filter', { nullable: true }) filter: RegistrationFilterInput = {},
    @CurrentUser() user: User,
  ) {

    return this.registrationsService.findAll(filter, user.id, user.role);
  }

  @Query(() => [Registration], { name: 'myRegistrations' })
  @UseGuards(Auth0Guard)
  async findMyRegistrations(@CurrentUser() user: User) {

    return this.registrationsService.getMyRegistrations(user.id);
  }

  @Query(() => [Registration], { name: 'eventRegistrations' })
  @UseGuards(Auth0Guard)
  async findEventRegistrations(
    @Args('eventId', { type: () => ID }) eventId: string,
    @Args('filter', { nullable: true }) filter: RegistrationFilterInput = {},
    @CurrentUser() user: User,
  ) {


    // Add eventId to filter
    const eventFilter = { ...filter, eventId };

    return this.registrationsService.findAll(eventFilter, user.id, user.role);
  }

  @Query(() => Registration, { name: 'registration' })
  @UseGuards(Auth0Guard)
  async findOneRegistration(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() user: User,
  ) {

    return this.registrationsService.findOne(id, user.id, user.role);
  }

  @Mutation(() => Registration)
  @UseGuards(Auth0Guard)
  async updateRegistration(
    @Args('updateRegistrationInput')
    updateRegistrationInput: UpdateRegistrationInput,
    @CurrentUser() user: User,
  ) {

    return this.registrationsService.update(
      updateRegistrationInput.id,
      updateRegistrationInput,
      user.id,
      user.role,
    );
  }

  @Mutation(() => Registration)
  @UseGuards(Auth0Guard)
  async cancelRegistration(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() user: User,
  ) {

    return this.registrationsService.cancel(id, user.id, user.role);
  }

  @Query(() => Int, { name: 'registrationsCount' })
  @UseGuards(Auth0Guard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async getRegistrationsCount(
    @Args('filter', { nullable: true }) filter: RegistrationFilterInput = {},
    @CurrentUser() user: User,
  ) {

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


    const filter = { eventId, status: RegistrationStatus.CONFIRMED }; // Fix: Use enum instead of string
    const confirmedRegistrations =
      await this.registrationsService.findAll(filter);

    return {
      confirmedCount: confirmedRegistrations.length,
      // Additional capacity info can be added here
    };
  }

  @Mutation(() => Boolean)
  @UseGuards(Auth0Guard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async markAttendance(
    @Args('registrationId', { type: () => ID }) registrationId: string,
    @Args('attended', { type: () => Boolean }) attended: boolean,
    @CurrentUser() user: User,
  ) {


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




}
