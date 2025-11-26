import { Resolver, Query, Mutation, Args, ID, Int, ResolveField, Parent } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { EventsService } from './events.service';
import { Event } from './entities/event.entity';
import { CreateEventInput } from './dto/create-event.input';
import { UpdateEventInput } from './dto/update-event.input';
import { EventsFilterInput } from './dto/events-filter.input';
import { Auth0Guard } from '../auth/guards/auth0.guard';
import { OrganizerGuard } from './guards/organizer.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { PaginatedEvents } from './dto/paginated-events.output';
import { EventStatus, RegistrationStatus } from '@prisma/client';

@Resolver(() => Event)
export class EventsResolver {
  constructor(private readonly eventsService: EventsService) { }

  @Mutation(() => Event)
  @UseGuards(Auth0Guard, OrganizerGuard)
  async createEvent(
    @Args('createEventInput') createEventInput: CreateEventInput,
    @CurrentUser() user: User,
  ) {
    return this.eventsService.create(createEventInput, user.id);
  }

  @Query(() => PaginatedEvents, { name: 'events' })
  async findAll(
    @Args('filter', { nullable: true }) filter: EventsFilterInput = {},
    @Args('includePrivate', { nullable: true, defaultValue: false })
    includePrivate: boolean = false,
  ) {
    // For public access, don't pass userId
    const userId = includePrivate ? undefined : undefined;
    // Public query always treats user as guest/regular for filtering purposes (unless we want to support admin seeing drafts on homepage?)
    // For now, let's keep homepage strictly public/published only.
    return this.eventsService.findAll(filter, userId, undefined);
  }

  @Query(() => PaginatedEvents, { name: 'adminEvents' })
  @UseGuards(Auth0Guard)
  async adminEvents(
    @Args('filter', { nullable: true }) filter: EventsFilterInput = {},
    @CurrentUser() user: User,
  ) {
    return this.eventsService.findAll(filter, user.id, user.role);
  }

  @Query(() => [Event], { name: 'myEvents' })
  @UseGuards(Auth0Guard)
  async findMyEvents(@CurrentUser() user: User) {
    return this.eventsService.getMyEvents(user.id);
  }

  @Query(() => Event, { name: 'event' })
  async findOne(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() user?: User,
  ) {
    return this.eventsService.findOne(id, user?.id, user?.role);
  }

  @Mutation(() => Event)
  @UseGuards(Auth0Guard)
  async updateEvent(
    @Args('updateEventInput') updateEventInput: UpdateEventInput,
    @CurrentUser() user: User,
  ) {
    return this.eventsService.update(
      updateEventInput.id,
      updateEventInput,
      user.id,
      user.role,
    );
  }

  @Mutation(() => Boolean)
  @UseGuards(Auth0Guard)
  async removeEvent(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() user: User,
  ) {
    return this.eventsService.remove(id, user.id, user.role);
  }

  @Mutation(() => Event)
  @UseGuards(Auth0Guard)
  async publishEvent(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() user: User,
  ) {
    return this.eventsService.publish(id, user.id, user.role);
  }

  @Query(() => Int, { name: 'eventsCount' })
  async getEventsCount(
    @Args('filter', { nullable: true }) filter: EventsFilterInput = {},
  ) {
    const events = await this.eventsService.findAll(filter);
    return events.total;
  }

  @ResolveField(() => Int)
  async confirmedCount(@Parent() event: Event) {
    if (event.confirmedCount !== undefined) return event.confirmedCount;
    return this.eventsService.countRegistrations(event.id, [
      RegistrationStatus.CONFIRMED,
      RegistrationStatus.ATTENDED,
      RegistrationStatus.NO_SHOW,
    ]);
  }

  @ResolveField(() => Int)
  async pendingCount(@Parent() event: Event) {
    if (event.pendingCount !== undefined) return event.pendingCount;
    return this.eventsService.countRegistrations(event.id, 'PENDING');
  }

  @ResolveField(() => Int)
  async cancelledCount(@Parent() event: Event) {
    if (event.cancelledCount !== undefined) return event.cancelledCount;
    return this.eventsService.countRegistrations(event.id, 'CANCELLED');
  }

  @ResolveField(() => EventStatus)
  async status(@Parent() event: Event) {
    // If registrationCount is missing (e.g. raw Prisma object), default to 0
    // Ideally, the service should always provide it, but this is a fallback
    const count = event.registrationCount || 0;
    return this.eventsService.computeEventStatus(event, count);
  }
}
