import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FeedbackType, UserRole } from '@prisma/client';
import Filter from 'bad-words';

@Injectable()
export class FeedbackService {
    private filter: any;

    constructor(private prisma: PrismaService) {
        this.filter = new Filter();
    }

    async create(userId: string, message: string, type: FeedbackType) {
        const cleanMessage = this.filter.clean(message);

        return this.prisma.feedback.create({
            data: {
                userId,
                message: cleanMessage,
                type,
            },
            include: {
                user: true,
            },
        });
    }

    async findAll() {
        return this.prisma.feedback.findMany({
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                user: true,
            },
        });
    }

    async update(id: string, userId: string, message: string, type: FeedbackType) {
        const feedback = await this.prisma.feedback.findUnique({
            where: { id },
        });

        if (!feedback) {
            throw new NotFoundException('Feedback not found');
        }

        if (feedback.userId !== userId) {
            throw new ForbiddenException('You can only edit your own feedback');
        }

        const cleanMessage = this.filter.clean(message);

        return this.prisma.feedback.update({
            where: { id },
            data: {
                message: cleanMessage,
                type,
            },
            include: {
                user: true,
            },
        });
    }

    async delete(id: string, userId: string, userRole: UserRole) {
        const feedback = await this.prisma.feedback.findUnique({
            where: { id },
        });

        if (!feedback) {
            throw new NotFoundException('Feedback not found');
        }

        const isAdmin = userRole === UserRole.ADMIN;
        const isOwner = feedback.userId === userId;

        if (!isAdmin && !isOwner) {
            throw new ForbiddenException('You are not authorized to delete this feedback');
        }

        return this.prisma.feedback.delete({
            where: { id },
            include: {
                user: true,
            },
        });
    }
}
