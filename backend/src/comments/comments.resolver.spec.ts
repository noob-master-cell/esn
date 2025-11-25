import { Test, TestingModule } from '@nestjs/testing';
import { CommentsResolver } from './comments.resolver';
import { CommentsService } from './comments.service';
import { User } from '../users/entities/user.entity';
import { UserRole } from '@prisma/client';
import { CreateCommentInput } from './dto/create-comment.input';
import { Auth0Guard } from '../auth/guards/auth0.guard';

describe('CommentsResolver', () => {
    let resolver: CommentsResolver;
    let service: CommentsService;

    const mockCommentsService = {
        create: jest.fn(),
        findAll: jest.fn(),
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

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CommentsResolver,
                {
                    provide: CommentsService,
                    useValue: mockCommentsService,
                },
            ],
        })
            .overrideGuard(Auth0Guard)
            .useValue({ canActivate: jest.fn(() => true) })
            .compile();

        resolver = module.get<CommentsResolver>(CommentsResolver);
        service = module.get<CommentsService>(CommentsService);

        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(resolver).toBeDefined();
    });

    describe('createComment', () => {
        it('should call service.create', async () => {
            const createCommentInput: CreateCommentInput = {
                eventId: 'event-1',
                content: 'Test comment',
            };
            const expectedResult = { id: 'comment-1', ...createCommentInput };
            mockCommentsService.create.mockResolvedValue(expectedResult);

            const result = await resolver.createComment(createCommentInput, mockUser);

            expect(service.create).toHaveBeenCalledWith(createCommentInput, mockUser);
            expect(result).toEqual(expectedResult);
        });
    });

    describe('findAll', () => {
        it('should call service.findAll', async () => {
            const expectedResult = [{ id: 'comment-1', content: 'Test' }];
            mockCommentsService.findAll.mockResolvedValue(expectedResult);

            const result = await resolver.findAll('event-1', 0, 10);

            expect(service.findAll).toHaveBeenCalledWith('event-1', 0, 10);
            expect(result).toEqual(expectedResult);
        });
    });
});
