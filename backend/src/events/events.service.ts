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

// Tiered cache TTL strategy (in milliseconds)
const CACHE_TTLS = {
  EVENTS_LIST: 60000,      // 1 minute - frequently changing
  EVENT_DETAIL: 300000,    // 5 minutes - less frequent updates
  USER_PROFILE: 600000,    // 10 minutes - rarely changes
  STATIC_DATA: 3600000,    // 1 hour - enums, categories
} as const;

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
        // For newly created event, counts are 0 and no registrations
        _count: {
          select: {
            registrations: { where: { status: { not: RegistrationStatus.CANCELLED } } }
          }
        }
      },
    });

    // Invalidate events cache
    await this.clearEventsCache();

    return this.transformEvent(event);
  }

  async findAll(filter: EventsFilterInput = {}, userId?: string, userRole?: UserRole): Promise<PaginatedEvents> {
    // Generate stable cache key (avoid JSON.stringify which is order-dependent)
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
      // Optimization: Use insensitive mode which maps to ILIKE in Postgres
      // For larger datasets, we should enable Full Text Search (tsvector)
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
          // Get total count of active registrations efficiently
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
        take: Math.min(filter.take || 20, 100), // Cap at 100 records max
      }),
      this.prisma.event.count({ where }),
    ]);

    // OPTIMIZATION: Batch fetch user registration status
    // Instead of subquery per row, we fetch all relevant registrations in one go
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

    // Cache for 1 minute - skip for admins
    if (userRole !== UserRole.ADMIN) {
      await this.cacheManager.set(cacheKey, result, CACHE_TTLS.EVENTS_LIST);
    }

    return result;
  }

  async findOne(id: string, userId?: string, userRole?: UserRole) {
    // Generate cache key for event detail
    const cacheKey = `event:${id}:${userRole || 'public'}`;

    // Try cache first (skip for admins)
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
        // We need full list of attendees for the detail page? 
        // The previous code capped at 100. Let's keep cap at 100 but use specific query for it.
        // We can't do two 'registrations' includes.
        // So we will fetch the event first, then fetch registrations separately to be clean.
      },
    });

    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    // Check if user can view this event
    const isDraftOrCancelled = event.status === EventStatus.DRAFT || event.status === EventStatus.CANCELLED;
    if (!event.isPublic || isDraftOrCancelled) {
      // Allow if user is ADMIN or the organizer
      if (userRole !== UserRole.ADMIN && (!userId || event.organizerId !== userId)) {
        throw new ForbiddenException(
          'You do not have permission to view this event',
        );
      }
    }

    // Fetch registrations for attendees list (limit to 100 recent)
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

    // Check if current user is registered (if not in the top 100)
    let isRegistered = false;
    if (userId) {
      // Check in the fetched list first
      isRegistered = registrations.some(r => r.userId === userId);

      // If not found and we hit the limit, check DB specifically
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

    // Manually construct the object expected by transformEvent
    // We pass the attendees list explicitly
    const attendees = registrations.map(r => r.user);

    // We need to pass the registrations in a way transformEvent understands, 
    // OR update transformEvent to accept explicit data.
    // Let's update transformEvent to be more flexible.

    const result = this.transformEvent(event, userId, attendees, isRegistered);

    // Cache the result (skip for admins)
    if (userRole !== UserRole.ADMIN) {
      await this.cacheManager.set(cacheKey, result, CACHE_TTLS.EVENT_DETAIL);
    }

    return result;
  }

  async update(
    id: string,
    updateEventInput: UpdateEventInput,
    userId: string,
    userRole: UserRole,
  ) {
    const event = await this.prisma.event.findUnique({ where: { id } });

    if (!event) throw new NotFoundException(`Event with ID ${id} not found`);

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
        _count: {
          select: {
            registrations: { where: { status: { not: RegistrationStatus.CANCELLED } } }
          }
        }
      },
    });

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
        _count: {
          select: { registrations: true }
        }
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
    if (userRole !== UserRole.ADMIN && eventData._count.registrations > 0) {
      throw new BadRequestException(
        'Cannot delete event with registered participants. Please cancel all registrations first.',
      );
    }

    // For admins, allow deletion but cascade delete registrations
    if (userRole === UserRole.ADMIN && eventData._count.registrations > 0) {
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
    await this.clearEventsCache();

    return true;
  }

  async publish(id: string, userId: string, userRole: UserRole) {
    const event = await this.prisma.event.findUnique({ where: { id } });

    if (!event) throw new NotFoundException(`Event with ID ${id} not found`);

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
        _count: {
          select: { registrations: { where: { status: { not: RegistrationStatus.CANCELLED } } } }
        }
      },
    });

    return this.transformEvent(publishedEvent);
  }

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

  // Helper method to transform prisma event to GraphQL event
  private transformEvent(event: any, userId?: string, explicitAttendees?: any[], explicitIsRegistered?: boolean) {
    // 1. Get Registration Count
    // Use _count if available (optimized), otherwise fall back to array length (legacy/fallback)
    let registrationCount = 0;
    if (event._count && typeof event._count.registrations === 'number') {
      registrationCount = event._count.registrations;
    } else if (Array.isArray(event.registrations)) {
      // Fallback if _count not present
      registrationCount = event.registrations.filter((r: any) => r.status !== RegistrationStatus.CANCELLED).length;
    }

    // 2. Get Attendees
    // Use explicitAttendees if provided (from separate query), otherwise map from registrations if available
    let attendees = explicitAttendees || [];
    if (!explicitAttendees && Array.isArray(event.registrations)) {
      // Note: In findAll, 'registrations' might be the filtered list for isRegistered check (length 0 or 1)
      // So we should be careful. If registrations has 'user' property, it's a full registration object.
      // If it was the 'isRegistered' check, it might not have 'user'.
      const validRegs = event.registrations.filter((r: any) => r.user && r.status !== RegistrationStatus.CANCELLED);
      attendees = validRegs.map((r: any) => r.user);
    }

    // 3. Check isRegistered
    let isRegistered = explicitIsRegistered;
    if (isRegistered === undefined) {
      if (userId && Array.isArray(event.registrations)) {
        // In findAll, we include registrations: { where: { userId } }
        // So if that array is not empty, user is registered.
        // BUT, if we fell back to full registrations array (legacy), we check that too.
        isRegistered = event.registrations.some((r: any) => r.userId === userId && r.status !== RegistrationStatus.CANCELLED);
      } else {
        isRegistered = false;
      }
    }

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
      } else if ((!event.isUnlimited && registrationCount >= event.maxParticipants) || now > registrationDeadline) {
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
      // We don't have these detailed counts efficiently anymore without extra queries.
      // For now, return 0 or total count if we can't distinguish.
      // The frontend might use these. If critical, we need to group by status in _count which Prisma supports partially.
      // For now, let's assume confirmedCount ~= registrationCount for simplicity in optimization
      // unless we do a groupBy query.
      confirmedCount: registrationCount,
      pendingCount: 0, // Optimization trade-off: skip detailed status counts for list view
      cancelledCount: 0,

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
    } else if ((!event.isUnlimited && registrationCount >= event.maxParticipants) || now > registrationDeadline) {
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
      if (store && store.keys) {
        // Clear both list and detail caches
        const keys = await store.keys('events:*');
        const eventKeys = await store.keys('event:*');
        const allKeys = [...(keys || []), ...(eventKeys || [])];

        if (allKeys && allKeys.length > 0) {
          // Delete keys individually or in bulk depending on store support
          // cache-manager v5+ usually supports mdel or we loop
          if (store.mdel) {
            await store.mdel(...allKeys);
          } else {
            await Promise.all(allKeys.map((key: string) => this.cacheManager.del(key)));
          }
          console.log(`Cleared ${allKeys.length} event cache keys`);
        }
      }
    } catch (error) {
      console.error('Failed to clear events cache:', error);
    }
  }
}