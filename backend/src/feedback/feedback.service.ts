import { Injectable, NotFoundException, ForbiddenException, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { PrismaService } from '../prisma/prisma.service';
import { FeedbackType, UserRole } from '@prisma/client';
import Filter from 'bad-words';

// Cache TTL for feedback list (2 minutes - admin-only, less frequently accessed)
const FEEDBACK_CACHE_TTL = 120000; // 2 minutes

@Injectable()
export class FeedbackService {
    private filter: any;

    constructor(
        private prisma: PrismaService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ) {
        this.filter = new Filter();
    }

    async create(userId: string, message: string, type: FeedbackType) {
        const cleanMessage = this.filter.clean(message);

        const feedback = await this.prisma.feedback.create({
            data: {
                userId,
                message: cleanMessage,
                type,
            },
            include: {
                user: true,
            },
        });

        // Invalidate feedback cache
        await this.clearFeedbackCache();

        return feedback;
    }

    async findAll() {
        const cacheKey = 'feedback:all';

        // Try cache first
        const cached = await this.cacheManager.get(cacheKey);
        if (cached) {
            return cached;
        }

        // Fetch from database
        const feedback = await this.prisma.feedback.findMany({
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                user: true,
            },
        });

        // Cache the result
        await this.cacheManager.set(cacheKey, feedback, FEEDBACK_CACHE_TTL);

        return feedback;
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

        const updated = await this.prisma.feedback.update({
            where: { id },
            data: {
                message: cleanMessage,
                type,
            },
            include: {
                user: true,
            },
        });

        // Invalidate feedback cache
        await this.clearFeedbackCache();

        return updated;
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

        const deleted = await this.prisma.feedback.delete({
            where: { id },
            include: {
                user: true,
            },
        });

        // Invalidate feedback cache
        await this.clearFeedbackCache();

        return deleted;
    }

    // Helper method to clear feedback cache
    private async clearFeedbackCache() {
        try {
            await this.cacheManager.del('feedback:all');
        } catch (error) {
            console.error('Failed to clear feedback cache:', error);
        }
    }
}
