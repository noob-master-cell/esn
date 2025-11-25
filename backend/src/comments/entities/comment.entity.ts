import { ObjectType, Field, ID } from '@nestjs/graphql';
import { User } from '../../users/entities/user.entity';

@ObjectType()
export class Comment {
    @Field(() => ID)
    id: string;

    @Field()
    content: string;

    @Field()
    createdAt: Date;

    @Field(() => User)
    user: User;

    @Field()
    userId: string;

    @Field()
    eventId: string;
}
