import { Resolver, Query, Mutation, Args, Context, Int, Subscription } from '@nestjs/graphql';
import { UseGuards, Inject } from '@nestjs/common';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { CommentsService } from './comments.service';
import { Comment } from './entities/comment.entity';
import { CreateCommentInput } from './dto/create-comment.input';
import { Auth0Guard } from '../auth/guards/auth0.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { PUB_SUB } from '../common/pubsub.module';

/**
 * Resolver for handling Comment-related GraphQL operations.
 * Manages creation and retrieval of comments, including real-time subscriptions.
 */
@Resolver(() => Comment)
export class CommentsResolver {
    constructor(
        private readonly commentsService: CommentsService,
        @Inject(PUB_SUB) private readonly pubSub: RedisPubSub,
    ) { }

    /**
     * Creates a new comment on an event.
     * Requires authentication.
     * Publishes the new comment to subscribers.
     * 
     * @param createCommentInput - Data for creating the comment.
     * @param user - The currently authenticated user.
     * @returns The created comment.
     */
    @Mutation(() => Comment)
    @UseGuards(Auth0Guard)
    async createComment(
        @Args('createCommentInput') createCommentInput: CreateCommentInput,
        @CurrentUser() user: User,
    ) {
        const newComment = await this.commentsService.create(createCommentInput, user);
        this.pubSub.publish('commentAdded', { commentAdded: newComment });
        return newComment;
    }

    /**
     * Retrieves a paginated list of comments for a specific event.
     * 
     * @param eventId - ID of the event.
     * @param skip - Number of comments to skip (for pagination).
     * @param take - Number of comments to retrieve.
     * @returns List of comments.
     */
    @Query(() => [Comment], { name: 'comments' })
    findAll(
        @Args('eventId', { type: () => String }) eventId: string,
        @Args('skip', { type: () => Int, nullable: true, defaultValue: 0 }) skip: number,
        @Args('take', { type: () => Int, nullable: true, defaultValue: 10 }) take: number,
    ) {
        return this.commentsService.findAll(eventId, skip, take);
    }

    /**
     * Subscription for real-time comment updates on a specific event.
     * 
     * @param eventId - ID of the event to subscribe to.
     * @returns AsyncIterator for comment updates.
     */
    @Subscription(() => Comment, {
        filter: (payload, variables) => {
            return payload.commentAdded.eventId === variables.eventId;
        },
        resolve: (payload) => {
            const comment = payload.commentAdded;
            return {
                ...comment,
                createdAt: new Date(comment.createdAt),
            };
        },
    })
    commentAdded(@Args('eventId') eventId: string) {
        return this.pubSub.asyncIterator('commentAdded');
    }
}
