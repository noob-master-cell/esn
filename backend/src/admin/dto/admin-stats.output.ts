import { ObjectType, Field, Int, Float } from '@nestjs/graphql';

@ObjectType()
export class AdminStats {
    @Field(() => Int)
    totalEvents: number;

    @Field(() => Int)
    activeUsers: number;

    @Field(() => Int)
    totalRegistrations: number;

    @Field(() => Float)
    totalRevenue: number;

    @Field(() => Int)
    eventsThisMonth: number;

    @Field(() => Int)
    registrationsThisMonth: number;

    @Field(() => Float)
    revenueThisMonth: number;

    @Field(() => Float, { nullable: true })
    eventsChange?: number;

    @Field(() => Float, { nullable: true })
    activeUsersChange?: number;

    @Field(() => Float, { nullable: true })
    registrationsChange?: number;

    @Field(() => Float, { nullable: true })
    revenueChange?: number;
}
