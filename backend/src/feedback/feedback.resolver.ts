import { Resolver, Query, Mutation, Args, ObjectType, Field, ID, registerEnumType, Subscription } from '@nestjs/graphql';
import { UseGuards, Inject } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { Auth0Guard } from '../auth/guards/auth0.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { FeedbackType } from '@prisma/client';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { PUB_SUB } from '../common/pubsub.module';

// Register Enum
registerEnumType(FeedbackType, {
    name: 'FeedbackType',
});

// Define Feedback Entity for GraphQL
@ObjectType()
export class Feedback {
    @Field(() => ID)
    id: string;

    @Field()
    message: string;

    @Field(() => FeedbackType)
    type: FeedbackType;

    @Field()
    createdAt: Date;

    @Field(() => User)
    user: User;
}

@Resolver(() => Feedback)
export class FeedbackResolver {
    constructor(
        private readonly feedbackService: FeedbackService,
        @Inject(PUB_SUB) private readonly pubSub: RedisPubSub,
    ) { }

    @Mutation(() => Feedback)
    @UseGuards(Auth0Guard)
    async createFeedback(
        @Args('message') message: string,
        @Args('type', { type: () => FeedbackType }) type: FeedbackType,
        @CurrentUser() user: User,
    ) {
        const feedback = await this.feedbackService.create(user.id, message, type);
        this.pubSub.publish('feedbackAdded', { feedbackAdded: feedback });
        return feedback;
    }

    @Mutation(() => Feedback)
    @UseGuards(Auth0Guard)
    async updateFeedback(
        @Args('id') id: string,
        @Args('message') message: string,
        @Args('type', { type: () => FeedbackType }) type: FeedbackType,
        @CurrentUser() user: User,
    ) {
        return this.feedbackService.update(id, user.id, message, type);
    }

    @Mutation(() => Feedback)
    @UseGuards(Auth0Guard)
    async deleteFeedback(
        @Args('id') id: string,
        @CurrentUser() user: User,
    ) {
        return this.feedbackService.delete(id, user.id, user.role);
    }

    @Query(() => [Feedback], { name: 'feedbacks' })
    async findAll() {
        return this.feedbackService.findAll();
    }

    @Subscription(() => Feedback, {
        resolve: (payload) => {
            const feedback = payload.feedbackAdded;
            return {
                ...feedback,
                createdAt: new Date(feedback.createdAt),
            };
        },
    })
    feedbackAdded() {
        return this.pubSub.asyncIterator('feedbackAdded');
    }
}
