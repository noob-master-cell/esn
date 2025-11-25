import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FeedbackType } from '@prisma/client';

@Injectable()
export class FeedbackService {
    constructor(private prisma: PrismaService) { }

    async create(userId: string, message: string, type: FeedbackType) {
        return this.prisma.feedback.create({
            data: {
                userId,
                message,
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
}
