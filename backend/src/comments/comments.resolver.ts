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

@Resolver(() => Comment)
export class CommentsResolver {
    constructor(
        private readonly commentsService: CommentsService,
        @Inject(PUB_SUB) private readonly pubSub: RedisPubSub,
    ) { }

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

    @Query(() => [Comment], { name: 'comments' })
    findAll(
        @Args('eventId', { type: () => String }) eventId: string,
        @Args('skip', { type: () => Int, nullable: true, defaultValue: 0 }) skip: number,
        @Args('take', { type: () => Int, nullable: true, defaultValue: 10 }) take: number,
    ) {
        return this.commentsService.findAll(eventId, skip, take);
    }

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
