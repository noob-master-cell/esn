import { Injectable, NotFoundException, ForbiddenException, BadRequestException, Inject, OnModuleInit } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventInput } from './dto/create-event.input';
import { UpdateEventInput } from './dto/update-event.input';
import { EventsFilterInput } from './dto/events-filter.input';
import { EventStatus, UserRole, RegistrationStatus, Prisma } from '@prisma/client';
import { PaginatedEvents } from './dto/paginated-events.output';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { PaginationArgs } from '../common/dto/pagination.args';
import { EventConnection, EventEdge } from './dto/event-connection.output';
import { PageInfo } from '../common/dto/page-info.output';

/**
 * Cache Time-To-Live (TTL) configuration in milliseconds.
 */
const CACHE_TTLS = {
  EVENTS_LIST: 60000,      // 1 minute
  EVENT_DETAIL: 300000,    // 5 minutes
  USER_PROFILE: 600000,    // 10 minutes
  STATIC_DATA: 3600000,    // 1 hour
} as const;

/**
 * Service responsible for managing events, including creation, retrieval, updates, and deletion.
 * Handles business logic for event status transitions and caching.
 */
@Injectable()
export class EventsService implements OnModuleInit {
  constructor(
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private cloudinaryService: CloudinaryService,
  ) { }

  /**
   * Lifecycle hook called on module initialization.
   * Sets up a periodic job to update event statuses.
   */
  onModuleInit() {
    setInterval(() => {
      this.checkEventStatus();
    }, 3600000);

    this.checkEventStatus();
  }

  /**
   * Checks and updates the status of past events to COMPLETED.
   * Runs periodically to ensure event statuses remain accurate.
   */
  async checkEventStatus() {
    try {
      const now = new Date();

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
        await this.prisma.event.updateMany({
          where: {
            id: { in: eventsToComplete.map(e => e.id) },
          },
          data: {
            status: EventStatus.COMPLETED,
          },
        });

        await this.clearEventsCache();
      }
    } catch (error) {
      console.error('Error checking event status:', error);
    }
  }

  /**
   * Creates a new event.
   * 
   * @param createEventInput - Data for creating the event.
   * @param organizerId - ID of the user creating the event.
   * @returns The created event.
   * @throws BadRequestException if date validation fails.
   */
  async create(createEventInput: CreateEventInput, organizerId: string) {
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
        _count: {
          select: {
            registrations: { where: { status: { not: RegistrationStatus.CANCELLED } } }
          }
        }
      },
    });

    await this.clearEventsCache();

    return this.transformEvent(event);
  }

  /**
   * Retrieves a paginated list of events based on filters.
   * 
   * @param filter - Filtering criteria (category, date, search, etc.).
   * @param userId - ID of the requesting user (optional).
   * @param userRole - Role of the requesting user (optional).
   * @returns Paginated list of events.
   */
  async findAll(filter: EventsFilterInput = {}, userId?: string, userRole?: UserRole): Promise<PaginatedEvents> {
    const cacheKey = [
      'events',
      filter.category || 'all',
      filter.type || 'all',
      filter.status || 'all',
      filter.location || 'all',
      filter.search || 'none',
      filter.skip || 0,
      filter.take || 20,
      userId || 'public',
      userRole || 'guest'
    ].join(':');

    if (userRole !== UserRole.ADMIN) {
      const cached = await this.cacheManager.get<PaginatedEvents>(cacheKey);
      if (cached) {
        return cached;
      }
    }

    const where = this.buildWhereClause(filter, userRole);

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
          _count: {
            select: {
              registrations: {
                where: {
                  status: {
                    not: RegistrationStatus.CANCELLED,
                  },
                },
              },
            },
          },
        },
        orderBy,
        skip: filter.skip || 0,
        take: Math.min(filter.take || 20, 100),
      }),
      this.prisma.event.count({ where }),
    ]);

    let registeredEventIds = new Set<string>();
    if (userId && items.length > 0) {
      const eventIds = items.map(e => e.id);
      const userRegistrations = await this.prisma.registration.findMany({
        where: {
          userId,
          eventId: { in: eventIds },
          status: { not: RegistrationStatus.CANCELLED }
        },
        select: { eventId: true }
      });
      registeredEventIds = new Set(userRegistrations.map(r => r.eventId));
    }

    const result = {
      items: items.map((event) => this.transformEvent(
        event,
        userId,
        [],
        userId ? registeredEventIds.has(event.id) : false
      )),
      total,
    };

    if (userRole !== UserRole.ADMIN) {
      await this.cacheManager.set(cacheKey, result, CACHE_TTLS.EVENTS_LIST);
    }

    return result;
  }

  /**
   * Retrieves events using cursor-based pagination (Relay style).
   * 
   * @param paginationArgs - Cursor pagination arguments (first, after).
   * @param filter - Filtering criteria.
   * @param userId - ID of the requesting user.
   * @param userRole - Role of the requesting user.
   * @returns EventConnection object.
   */
  async findConnection(
    paginationArgs: PaginationArgs,
    filter: EventsFilterInput = {},
    userId?: string,
    userRole?: UserRole
  ): Promise<EventConnection> {
    const { first = 20, after } = paginationArgs;
    const take = Math.min(first || 20, 100); // Limit max take

    const where = this.buildWhereClause(filter, userRole);

    // Default sort by createdAt desc, then id desc for stability
    const orderBy: Prisma.EventOrderByWithRelationInput[] = [
      { createdAt: 'desc' },
      { id: 'desc' }
    ];

    let cursor: Prisma.EventWhereUniqueInput | undefined;
    if (after) {
      const decoded = this.decodeCursor(after);
      if (decoded) {
        cursor = { id: decoded.id };
      }
    }

    const [items, totalCount] = await Promise.all([
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
          _count: {
            select: {
              registrations: {
                where: {
                  status: {
                    not: RegistrationStatus.CANCELLED,
                  },
                },
              },
            },
          },
        },
        orderBy,
        take: take + 1, // Fetch one extra to check for next page
        cursor,
        skip: cursor ? 1 : 0, // Skip the cursor itself
      }),
      this.prisma.event.count({ where }),
    ]);

    const hasNextPage = items.length > take;
    const nodes = hasNextPage ? items.slice(0, take) : items;

    let registeredEventIds = new Set<string>();
    if (userId && nodes.length > 0) {
      const eventIds = nodes.map(e => e.id);
      const userRegistrations = await this.prisma.registration.findMany({
        where: {
          userId,
          eventId: { in: eventIds },
          status: { not: RegistrationStatus.CANCELLED }
        },
        select: { eventId: true }
      });
      registeredEventIds = new Set(userRegistrations.map(r => r.eventId));
    }

    const edges: EventEdge[] = nodes.map(event => ({
      cursor: this.encodeCursor(event),
      node: this.transformEvent(
        event,
        userId,
        [],
        userId ? registeredEventIds.has(event.id) : false
      ),
    }));

    const pageInfo: PageInfo = {
      hasNextPage,
      hasPreviousPage: !!after, // Simplified approximation
      startCursor: edges.length > 0 ? edges[0].cursor : null,
      endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null,
    };

    return {
      edges,
      pageInfo,
      totalCount,
    };
  }

  /**
   * Builds the Prisma where clause based on filters and user role.
   */
  private buildWhereClause(filter: EventsFilterInput, userRole?: UserRole): any {
    const where: any = {};

    if (filter.search) {
      where.OR = [
        { title: { contains: filter.search, mode: 'insensitive' } },
        { description: { contains: filter.search, mode: 'insensitive' } },
        { location: { contains: filter.search, mode: 'insensitive' } },
      ];
    }

    if (filter.category) where.category = filter.category;
    if (filter.type) where.type = filter.type;
    if (filter.status) where.status = filter.status;
    if (filter.location)
      where.location = { contains: filter.location, mode: 'insensitive' };

    if (filter.startDate || filter.endDate) {
      where.startDate = {};
      if (filter.startDate) where.startDate = { ...where.startDate as any, gte: filter.startDate };
      if (filter.endDate) where.startDate = { ...where.startDate as any, lte: filter.endDate };
    }

    if (filter.availableOnly) {
      where.registrations = {
        _count: {
          lt: where.maxParticipants || 999999,
        },
      };
    }

    if (userRole !== UserRole.ADMIN) {
      where.status = EventStatus.PUBLISHED;
      where.isPublic = true;
    }

    return where;
  }

  private encodeCursor(event: any): string {
    // Encode createdAt and id to ensure uniqueness and sort order
    const payload = JSON.stringify({ c: event.createdAt.toISOString(), i: event.id });
    return Buffer.from(payload).toString('base64');
  }

  private decodeCursor(cursor: string): { createdAt: Date, id: string } | null {
    try {
      const payload = Buffer.from(cursor, 'base64').toString('ascii');
      const data = JSON.parse(payload);
      return { createdAt: new Date(data.c), id: data.i };
    } catch (e) {
      return null;
    }
  }

  /**
   * Retrieves a single event by ID.
   * 
   * @param id - Event ID.
   * @param userId - ID of the requesting user (optional).
   * @param userRole - Role of the requesting user (optional).
   * @returns The requested event.
   * @throws NotFoundException if event is not found.
   * @throws ForbiddenException if user lacks permission to view the event.
   */
  async findOne(id: string, userId?: string, userRole?: UserRole) {
    const cacheKey = `event:${id}:${userRole || 'public'}`;

    if (userRole !== UserRole.ADMIN) {
      const cached = await this.cacheManager.get(cacheKey);
      if (cached) {
        return cached;
      }
    }

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
        _count: {
          select: {
            registrations: {
              where: {
                status: {
                  not: RegistrationStatus.CANCELLED,
                },
              },
            },
          },
        },
      },
    });

    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    const isDraftOrCancelled = event.status === EventStatus.DRAFT || event.status === EventStatus.CANCELLED;
    if (!event.isPublic || isDraftOrCancelled) {
      if (userRole !== UserRole.ADMIN && (!userId || event.organizerId !== userId)) {
        throw new ForbiddenException(
          'You do not have permission to view this event',
        );
      }
    }

    const registrations = await this.prisma.registration.findMany({
      where: {
        eventId: id,
        status: { not: RegistrationStatus.CANCELLED }
      },
      take: 100,
      orderBy: { registeredAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
    });

    let isRegistered = false;
    if (userId) {
      isRegistered = registrations.some(r => r.userId === userId);

      if (!isRegistered && registrations.length >= 100) {
        const userReg = await this.prisma.registration.findUnique({
          where: {
            userId_eventId: {
              userId,
              eventId: id
            }
          }
        });
        isRegistered = !!userReg && userReg.status !== RegistrationStatus.CANCELLED;
      }
    }

    const attendees = registrations.map(r => r.user);

    const result = this.transformEvent(event, userId, attendees, isRegistered);

    if (userRole !== UserRole.ADMIN) {
      await this.cacheManager.set(cacheKey, result, CACHE_TTLS.EVENT_DETAIL);
    }

    return result;
  }

  /**
   * Updates an existing event.
   * 
   * @param id - Event ID.
   * @param updateEventInput - Data to update.
   * @param userId - ID of the user performing the update.
   * @param userRole - Role of the user performing the update.
   * @returns The updated event.
   * @throws NotFoundException if event is not found.
   * @throws ForbiddenException if user lacks permission.
   */
  async update(
    id: string,
    updateEventInput: UpdateEventInput,
    userId: string,
    userRole: UserRole,
  ) {
    const event = await this.prisma.event.findUnique({ where: { id } });

    if (!event) throw new NotFoundException(`Event with ID ${id} not found`);

    if (userRole !== UserRole.ADMIN && event.organizerId !== userId) {
      throw new ForbiddenException('You can only update your own events');
    }

    if (updateEventInput.endDate && updateEventInput.startDate) {
      if (updateEventInput.endDate <= updateEventInput.startDate) {
        throw new BadRequestException('End date must be after start date');
      }
    }

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
        _count: {
          select: {
            registrations: { where: { status: { not: RegistrationStatus.CANCELLED } } }
          }
        }
      },
    });

    await this.clearEventsCache();

    if (updateData.images) {
      const oldImages = event.images || [];
      const newImages = updateData.images;

      const imagesToDelete = oldImages.filter(img => !newImages.includes(img));

      for (const imageUrl of imagesToDelete) {
        const publicId = this.cloudinaryService.extractPublicIdFromUrl(imageUrl);
        if (publicId) {
          this.cloudinaryService.deleteImage(publicId).catch(err =>
            console.error(`Failed to delete image ${publicId}:`, err)
          );
        }
      }
    }

    return this.transformEvent(updatedEvent);
  }

  /**
   * Deletes an event.
   * 
   * @param id - Event ID.
   * @param userId - ID of the user performing the deletion.
   * @param userRole - Role of the user performing the deletion.
   * @returns True if deletion was successful.
   * @throws NotFoundException if event is not found.
   * @throws ForbiddenException if user lacks permission.
   * @throws BadRequestException if event has active registrations (for non-admins).
   */
  async remove(id: string, userId: string, userRole: UserRole) {
    const eventData = await this.prisma.event.findUnique({
      where: { id },
      include: {
        organizer: true,
        _count: {
          select: { registrations: true }
        }
      },
    });

    if (!eventData) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    if (userRole !== UserRole.ADMIN && eventData.organizerId !== userId) {
      throw new ForbiddenException('You can only delete your own events');
    }

    if (userRole !== UserRole.ADMIN && eventData._count.registrations > 0) {
      throw new BadRequestException(
        'Cannot delete event with registered participants. Please cancel all registrations first.',
      );
    }

    if (userRole === UserRole.ADMIN && eventData._count.registrations > 0) {
      await this.prisma.registration.deleteMany({
        where: { eventId: id },
      });
    }

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

    await this.clearEventsCache();

    return true;
  }

  /**
   * Publishes a draft event.
   * 
   * @param id - Event ID.
   * @param userId - ID of the user publishing the event.
   * @param userRole - Role of the user publishing the event.
   * @returns The published event.
   */
  async publish(id: string, userId: string, userRole: UserRole) {
    const event = await this.prisma.event.findUnique({ where: { id } });

    if (!event) throw new NotFoundException(`Event with ID ${id} not found`);

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
        _count: {
          select: { registrations: { where: { status: { not: RegistrationStatus.CANCELLED } } } }
        }
      },
    });

    return this.transformEvent(publishedEvent);
  }

  /**
   * Retrieves events organized by a specific user.
   * 
   * @param userId - ID of the organizer.
   * @returns List of events.
   */
  async getMyEvents(userId: string) {
    const events = await this.prisma.event.findMany({
      where: { organizerId: userId },
      include: {
        organizer: true,
        _count: {
          select: { registrations: { where: { status: { not: RegistrationStatus.CANCELLED } } } }
        }
      },
      orderBy: { createdAt: 'desc' },
    });

    return events.map((event) => this.transformEvent(event));
  }

  /**
   * Transforms a Prisma event object into the GraphQL Event type.
   * Computes derived fields like status and registration counts.
   * 
   * @param event - Raw Prisma event object.
   * @param userId - ID of the current user (optional).
   * @param explicitAttendees - Pre-fetched attendees list (optional).
   * @param explicitIsRegistered - Pre-calculated registration status (optional).
   * @returns Transformed event object.
   */
  private transformEvent(event: any, userId?: string, explicitAttendees?: any[], explicitIsRegistered?: boolean) {
    let registrationCount = 0;
    if (event._count && typeof event._count.registrations === 'number') {
      registrationCount = event._count.registrations;
    } else if (Array.isArray(event.registrations)) {
      registrationCount = event.registrations.filter((r: any) => r.status !== RegistrationStatus.CANCELLED).length;
    }

    let attendees = explicitAttendees || [];
    if (!explicitAttendees && Array.isArray(event.registrations)) {
      const validRegs = event.registrations.filter((r: any) => r.user && r.status !== RegistrationStatus.CANCELLED);
      attendees = validRegs.map((r: any) => r.user);
    }

    let isRegistered = explicitIsRegistered;
    if (isRegistered === undefined) {
      if (userId && Array.isArray(event.registrations)) {
        isRegistered = event.registrations.some((r: any) => r.userId === userId && r.status !== RegistrationStatus.CANCELLED);
      } else {
        isRegistered = false;
      }
    }

    let status = event.status;
    const now = new Date();
    const startDate = new Date(event.startDate);
    const endDate = new Date(event.endDate);
    const registrationDeadline = event.registrationDeadline ? new Date(event.registrationDeadline) : startDate;

    // Determine the dynamic status of the event based on time and capacity
    if (event.status === EventStatus.PUBLISHED) {
      if (now > endDate) {
        status = EventStatus.COMPLETED;
      } else if (now > startDate) {
        status = EventStatus.ONGOING;
      } else if ((!event.isUnlimited && registrationCount >= event.maxParticipants) || now > registrationDeadline) {
        status = EventStatus.REGISTRATION_CLOSED;
      } else {
        status = EventStatus.REGISTRATION_OPEN;
      }
    }

    // Determine if the current user can register for this event
    const canRegister =
      !isRegistered &&
      status === EventStatus.REGISTRATION_OPEN;

    return {
      ...event,
      status,
      registrationCount,
      confirmedCount: registrationCount,
      pendingCount: 0, // These are populated by the dataloader in the resolver
      cancelledCount: 0, // These are populated by the dataloader in the resolver
      isRegistered,
      canRegister,
      attendees,
    };
  }

  /**
   * Computes the dynamic status of an event based on time and capacity.
   * 
   * @param event - Event object.
   * @param registrationCount - Current number of registrations.
   * @returns The computed EventStatus.
   */
  public computeEventStatus(event: any, registrationCount: number): string {
    // If the event is not published, return its static status (DRAFT, CANCELLED)
    if (event.status !== EventStatus.PUBLISHED) {
      return event.status;
    }

    const now = new Date();
    const startDate = new Date(event.startDate);
    const endDate = new Date(event.endDate);
    const registrationDeadline = event.registrationDeadline ? new Date(event.registrationDeadline) : startDate;

    // Calculate status based on current time relative to event timeline
    if (now > endDate) {
      return EventStatus.COMPLETED;
    } else if (now > startDate) {
      return EventStatus.ONGOING;
    } else if ((!event.isUnlimited && registrationCount >= event.maxParticipants) || now > registrationDeadline) {
      return EventStatus.REGISTRATION_CLOSED;
    } else {
      return EventStatus.REGISTRATION_OPEN;
    }
  }

  /**
   * Counts registrations for a specific event and status.
   * 
   * @param eventId - Event ID.
   * @param status - Registration status(es) to filter by.
   * @returns Count of registrations.
   */
  async countRegistrations(eventId: string, status: RegistrationStatus | RegistrationStatus[]) {
    const statusFilter = Array.isArray(status) ? { in: status } : status;
    return this.prisma.registration.count({
      where: {
        eventId,
        status: statusFilter,
      },
    });
  }

  /**
   * Clears all event-related cache keys.
   * Should be called after any event modification.
   */
  private async clearEventsCache() {
    try {
      const store = (this.cacheManager as any).store;
      if (store && store.keys) {
        const keys = await store.keys('events:*');
        const eventKeys = await store.keys('event:*');
        const allKeys = [...(keys || []), ...(eventKeys || [])];

        if (allKeys && allKeys.length > 0) {
          if (store.mdel) {
            await store.mdel(...allKeys);
          } else {
            await Promise.all(allKeys.map((key: string) => this.cacheManager.del(key)));
          }
        }
      }
    } catch (error) {
      console.error('Failed to clear events cache:', error);
    }
  }
}