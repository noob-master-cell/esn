import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class RegistrationStats {
    @Field(() => Int)
    total: number;

    @Field(() => Int)
    confirmed: number;

    @Field(() => Int)
    pending: number;

    @Field(() => Int)
    cancelled: number;
}
