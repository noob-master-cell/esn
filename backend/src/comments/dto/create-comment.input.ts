import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, MaxLength } from 'class-validator';

@InputType()
export class CreateCommentInput {
    @Field()
    @IsNotEmpty()
    @MaxLength(500, { message: 'Comment is too long (max 500 characters)' })
    content: string;

    @Field()
    @IsNotEmpty()
    eventId: string;
}
