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
import { EventStatus } from '@prisma/client';
import { EventCountsLoader } from '../dataloader/event-counts.loader';
import { EventConnection } from './dto/event-connection.output';
import { PaginationArgs } from '../common/dto/pagination.args';

/**
 * Resolver for handling Event-related GraphQL operations.
 * Exposes queries and mutations for managing events.
 */
@Resolver(() => Event)
export class EventsResolver {
  constructor(
    private readonly eventsService: EventsService,
    private readonly eventCountsLoader: EventCountsLoader,
  ) { }

  /**
   * Creates a new event.
   * Requires authentication and organizer privileges.
   * 
   * @param createEventInput - Data for creating the event.
   * @param user - The currently authenticated user.
   * @returns The created event.
   */
  @Mutation(() => Event)
  @UseGuards(Auth0Guard, OrganizerGuard)
  async createEvent(
    @Args('createEventInput') createEventInput: CreateEventInput,
    @CurrentUser() user: User,
  ) {
    return this.eventsService.create(createEventInput, user.id);
  }

  /**
   * Retrieves a paginated list of public events.
   * Can be filtered by various criteria.
   * 
   * @param filter - Filtering criteria (category, date, search, etc.).
   * @param includePrivate - Whether to include private events (not used currently).
   * @returns Paginated list of events.
   */
  @Query(() => PaginatedEvents, { name: 'events' })
  async findAll(
    @Args('filter', { nullable: true }) filter: EventsFilterInput = {},
    @Args('includePrivate', { nullable: true, defaultValue: false })
    includePrivate: boolean = false,
  ) {
    const userId = includePrivate ? undefined : undefined;
    return this.eventsService.findAll(filter, userId, undefined);
  }

  /**
   * Retrieves events using cursor-based pagination.
   * 
   * @param paginationArgs - Cursor pagination arguments (first, after).
   * @param filter - Filtering criteria.
   * @param user - The currently authenticated user (optional).
   * @returns EventConnection object.
   */
  @Query(() => EventConnection, { name: 'eventsConnection' })
  async eventsConnection(
    @Args() paginationArgs: PaginationArgs,
    @Args('filter', { nullable: true }) filter: EventsFilterInput = {},
    @CurrentUser() user?: User,
  ) {
    return this.eventsService.findConnection(paginationArgs, filter, user?.id, user?.role);
  }

  /**
   * Retrieves events for the admin dashboard.
   * Requires authentication.
   * 
   * @param filter - Filtering criteria.
   * @param user - The currently authenticated user.
   * @returns Paginated list of events for admin.
   */
  @Query(() => PaginatedEvents, { name: 'adminEvents' })
  @UseGuards(Auth0Guard)
  async adminEvents(
    @Args('filter', { nullable: true }) filter: EventsFilterInput = {},
    @CurrentUser() user: User,
  ) {
    return this.eventsService.findAll(filter, user.id, user.role);
  }

  /**
   * Retrieves events organized by the current user.
   * Requires authentication.
   * 
   * @param user - The currently authenticated user.
   * @returns List of events organized by the user.
   */
  @Query(() => [Event], { name: 'myEvents' })
  @UseGuards(Auth0Guard)
  async findMyEvents(@CurrentUser() user: User) {
    return this.eventsService.getMyEvents(user.id);
  }

  /**
   * Retrieves a single event by its ID.
   * 
   * @param id - Event ID.
   * @param user - The currently authenticated user (optional).
   * @returns The requested event.
   */
  @Query(() => Event, { name: 'event' })
  async findOne(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() user?: User,
  ) {
    return this.eventsService.findOne(id, user?.id, user?.role);
  }

  /**
   * Updates an existing event.
   * Requires authentication.
   * 
   * @param updateEventInput - Data to update.
   * @param user - The currently authenticated user.
   * @returns The updated event.
   */
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

  /**
   * Deletes an event.
   * Requires authentication.
   * 
   * @param id - Event ID.
   * @param user - The currently authenticated user.
   * @returns True if deletion was successful.
   */
  @Mutation(() => Boolean)
  @UseGuards(Auth0Guard)
  async removeEvent(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() user: User,
  ) {
    return this.eventsService.remove(id, user.id, user.role);
  }

  /**
   * Publishes a draft event.
   * Requires authentication.
   * 
   * @param id - Event ID.
   * @param user - The currently authenticated user.
   * @returns The published event.
   */
  @Mutation(() => Event)
  @UseGuards(Auth0Guard)
  async publishEvent(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() user: User,
  ) {
    return this.eventsService.publish(id, user.id, user.role);
  }

  /**
   * Retrieves the total count of events matching the filter.
   * 
   * @param filter - Filtering criteria.
   * @returns Total count of events.
   */
  @Query(() => Int, { name: 'eventsCount' })
  async getEventsCount(
    @Args('filter', { nullable: true }) filter: EventsFilterInput = {},
  ) {
    const events = await this.eventsService.findAll(filter);
    return events.total;
  }

  /**
   * Field resolver for confirmed registrations count.
   * Uses Dataloader to batch queries and prevent N+1 issues.
   * 
   * @param event - The parent event object.
   * @returns Number of confirmed registrations.
   */
  @ResolveField(() => Int)
  async confirmedCount(@Parent() event: Event) {
    if (event.confirmedCount !== undefined) return event.confirmedCount;
    const counts = await this.eventCountsLoader.batchCounts.load(event.id);
    return counts.confirmed;
  }

  /**
   * Field resolver for pending registrations count.
   * Uses Dataloader to batch queries.
   * 
   * @param event - The parent event object.
   * @returns Number of pending registrations.
   */
  @ResolveField(() => Int)
  async pendingCount(@Parent() event: Event) {
    if (event.pendingCount !== undefined) return event.pendingCount;
    const counts = await this.eventCountsLoader.batchCounts.load(event.id);
    return counts.pending;
  }

  /**
   * Field resolver for cancelled registrations count.
   * Uses Dataloader to batch queries.
   * 
   * @param event - The parent event object.
   * @returns Number of cancelled registrations.
   */
  @ResolveField(() => Int)
  async cancelledCount(@Parent() event: Event) {
    if (event.cancelledCount !== undefined) return event.cancelledCount;
    const counts = await this.eventCountsLoader.batchCounts.load(event.id);
    return counts.cancelled;
  }

  /**
   * Field resolver for computing event status.
   * 
   * @param event - The parent event object.
   * @returns The computed EventStatus.
   */
  @ResolveField(() => EventStatus)
  async status(@Parent() event: Event) {
    const count = event.registrationCount || 0;
    return this.eventsService.computeEventStatus(event, count);
  }
}
