import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Event } from '../entities/event.entity';

@ObjectType()
export class PaginatedEvents {
    @Field(() => [Event])
    items: Event[];

    @Field(() => Int)
    total: number;
}
