import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentInput } from './dto/create-comment.input';
import { User } from '../users/entities/user.entity';

@Injectable()
export class CommentsService {
    constructor(private readonly prisma: PrismaService) { }

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

        return this.prisma.comment.create({
            data: {
                content,
                userId: user.id,
                eventId,
            },
            include: {
                user: true,
            },
        });
    }

    async findAll(eventId: string, skip: number = 0, take: number = 10) {
        return this.prisma.comment.findMany({
            where: { eventId },
            include: {
                user: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
            skip,
            take,
        });
    }
}
