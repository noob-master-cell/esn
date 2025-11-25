import { Test, TestingModule } from '@nestjs/testing';
import { CommentsService } from './comments.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { UserRole } from '@prisma/client';
import { CreateCommentInput } from './dto/create-comment.input';

describe('CommentsService', () => {
    let service: CommentsService;
    let prisma: PrismaService;

    const mockPrismaService = {
        event: {
            findUnique: jest.fn(),
        },
        registration: {
            findFirst: jest.fn(),
        },
        comment: {
            create: jest.fn(),
            findMany: jest.fn(),
        },
    };

    const mockUser: User = {
        id: 'user-1',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        role: UserRole.USER,
        auth0Id: 'auth0|123',
        createdAt: new Date(),
        updatedAt: new Date(),
        esnCardVerified: false,
        emailVerified: true,
        isActive: true,
    };

    const mockEvent = {
        id: 'event-1',
        organizerId: 'organizer-1',
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CommentsService,
                {
                    provide: PrismaService,
                    useValue: mockPrismaService,
                },
            ],
        }).compile();

        service = module.get<CommentsService>(CommentsService);
        prisma = module.get<PrismaService>(PrismaService);

        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        const createCommentInput: CreateCommentInput = {
            eventId: 'event-1',
            content: 'Test comment',
        };

        it('should create a comment if user is registered', async () => {
            mockPrismaService.event.findUnique.mockResolvedValue(mockEvent);
            mockPrismaService.registration.findFirst.mockResolvedValue({ id: 'reg-1' });
            mockPrismaService.comment.create.mockResolvedValue({ id: 'comment-1', ...createCommentInput });

            const result = await service.create(createCommentInput, mockUser);

            expect(prisma.event.findUnique).toHaveBeenCalledWith({ where: { id: 'event-1' } });
            expect(prisma.registration.findFirst).toHaveBeenCalled();
            expect(prisma.comment.create).toHaveBeenCalled();
            expect(result).toEqual({ id: 'comment-1', ...createCommentInput });
        });

        it('should create a comment if user is organizer', async () => {
            const organizer = { ...mockUser, id: 'organizer-1' };
            mockPrismaService.event.findUnique.mockResolvedValue(mockEvent);
            // No registration needed
            mockPrismaService.registration.findFirst.mockResolvedValue(null);
            mockPrismaService.comment.create.mockResolvedValue({ id: 'comment-1', ...createCommentInput });

            const result = await service.create(createCommentInput, organizer);

            expect(prisma.comment.create).toHaveBeenCalled();
        });

        it('should create a comment if user is admin', async () => {
            const admin = { ...mockUser, role: UserRole.ADMIN };
            mockPrismaService.event.findUnique.mockResolvedValue(mockEvent);
            mockPrismaService.registration.findFirst.mockResolvedValue(null);
            mockPrismaService.comment.create.mockResolvedValue({ id: 'comment-1', ...createCommentInput });

            const result = await service.create(createCommentInput, admin);

            expect(prisma.comment.create).toHaveBeenCalled();
        });

        it('should throw NotFoundException if event does not exist', async () => {
            mockPrismaService.event.findUnique.mockResolvedValue(null);

            await expect(service.create(createCommentInput, mockUser)).rejects.toThrow(NotFoundException);
        });

        it('should throw ForbiddenException if user is not registered, organizer, or admin', async () => {
            mockPrismaService.event.findUnique.mockResolvedValue(mockEvent);
            mockPrismaService.registration.findFirst.mockResolvedValue(null);

            await expect(service.create(createCommentInput, mockUser)).rejects.toThrow(ForbiddenException);
        });
    });

    describe('findAll', () => {
        it('should return an array of comments', async () => {
            const comments = [{ id: 'comment-1', content: 'Test' }];
            mockPrismaService.comment.findMany.mockResolvedValue(comments);

            const result = await service.findAll('event-1');

            expect(prisma.comment.findMany).toHaveBeenCalledWith({
                where: { eventId: 'event-1' },
                include: { user: true },
                orderBy: { createdAt: 'desc' },
                skip: 0,
                take: 10,
            });
            expect(result).toEqual(comments);
        });
    });
});
