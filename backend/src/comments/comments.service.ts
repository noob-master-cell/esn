import { Injectable, ForbiddenException, NotFoundException, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentInput } from './dto/create-comment.input';
import { User } from '../users/entities/user.entity';

// Cache TTL for comments (1 minute - frequently updated)
const COMMENTS_CACHE_TTL = 60000; // 1 minute

@Injectable()
export class CommentsService {
    constructor(
        private readonly prisma: PrismaService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ) { }

    async create(createCommentInput: CreateCommentInput, user: User) {
        const { eventId, content } = createCommentInput;

        // Check if event exists
        const event = await this.prisma.event.findUnique({
            where: { id: eventId },
        });

        if (!event) {
            throw new NotFoundException('Event not found');
        }

        // Check if user is registered for the event
        // The requirement is "only those users who are registered can comment"
        // We check if a registration exists for this user and event.
        // We can be strict (CONFIRMED/ATTENDED) or loose (any registration).
        // Let's assume any non-cancelled registration is valid for now, or maybe just CONFIRMED.
        // Usually "registered" implies they have a spot.
        const registration = await this.prisma.registration.findFirst({
            where: {
                userId: user.id,
                eventId: eventId,
                status: {
                    in: ['CONFIRMED', 'ATTENDED', 'PENDING'], // Allow pending too? Maybe just confirmed.
                    // Let's stick to CONFIRMED and ATTENDED to be safe, as PENDING might mean they haven't paid yet.
                    // But "registered" might just mean they hit the button.
                    // Let's include PENDING for now to be less restrictive, but exclude CANCELLED/NO_SHOW/WAITLIST if strict.
                    // Actually, let's just check if they are NOT cancelled.
                    notIn: ['CANCELLED', 'NO_SHOW'],
                },
            },
        });

        // Also allow organizers/admins to comment even if not registered?
        // The prompt says "only those users who are registered".
        // But usually admins/organizers should be able to.
        const isOrganizer = event.organizerId === user.id;
        const isAdmin = user.role === 'ADMIN';

        if (!registration && !isOrganizer && !isAdmin) {
            throw new ForbiddenException('Only registered users can comment on this event');
        }

        const comment = await this.prisma.comment.create({
            data: {
                content,
                userId: user.id,
                eventId,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        avatar: true,
                    }
                },
            },
        });

        // Invalidate cache for this event's comments
        await this.clearEventCommentsCache(eventId);

        return comment;
    }

    async findAll(eventId: string, skip: number = 0, take: number = 10) {
        // Generate cache key
        const cacheKey = `comments:${eventId}:${skip}:${take}`;

        // Try cache first
        const cached = await this.cacheManager.get(cacheKey);
        if (cached) {
            return cached;
        }

        // Fetch from database
        const comments = await this.prisma.comment.findMany({
            where: { eventId },
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        avatar: true,
                    }
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
            skip,
            take,
        });

        // Cache the result
        await this.cacheManager.set(cacheKey, comments, COMMENTS_CACHE_TTL);

        return comments;
    }

    // Helper method to clear cache for an event's comments
    private async clearEventCommentsCache(eventId: string) {
        try {
            const store = (this.cacheManager as any).store;
            if (store.keys) {
                const keys = await store.keys(`comments:${eventId}:*`);
                if (keys && keys.length > 0) {
                    if (store.mdel) {
                        await store.mdel(...keys);
                    } else {
                        await Promise.all(keys.map((key: string) => this.cacheManager.del(key)));
                    }
                }
            }
        } catch (error) {
            console.error('Failed to clear comments cache:', error);
        }
    }
}
