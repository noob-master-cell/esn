import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Event } from '../entities/event.entity';
import { PageInfo } from '../../common/dto/page-info.output';

@ObjectType()
export class EventEdge {
    @Field(() => String)
    cursor: string;

    @Field(() => Event)
    node: Event;
}

@ObjectType()
export class EventConnection {
    @Field(() => [EventEdge])
    edges: EventEdge[];

    @Field(() => PageInfo)
    pageInfo: PageInfo;

    @Field(() => Int)
    totalCount: number;
}
