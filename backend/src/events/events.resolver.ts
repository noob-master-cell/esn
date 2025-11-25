import { Resolver, Query, Mutation, Args, ID, Int } from '@nestjs/graphql';
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
    return this.eventsService.findAll(filter, userId);
  }

  @Query(() => PaginatedEvents, { name: 'adminEvents' })
  @UseGuards(Auth0Guard)
  async adminEvents(
    @Args('filter', { nullable: true }) filter: EventsFilterInput = {},
    @CurrentUser() user: User,
  ) {
    return this.eventsService.findAll(filter, user.id);
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

    return this.eventsService.findOne(id, user?.id);
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
}
