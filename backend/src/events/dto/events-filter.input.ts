// backend/src/events/dto/events-filter.input.ts
import { InputType, Field, Int } from '@nestjs/graphql';
import {
  IsOptional,
  IsEnum,
  IsString,
  IsDate,
  IsInt,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
// Import enums directly from Prisma instead of entity file
import { EventCategory, EventType, EventStatus } from '@prisma/client';

@InputType()
export class EventsFilterInput {
  @Field({ nullable: true, description: 'Search term for title, description, or location' })
  @IsOptional()
  @IsString()
  search?: string;

  @Field(() => EventCategory, { nullable: true, description: 'Filter by event category' })
  @IsOptional()
  @IsEnum(EventCategory)
  category?: EventCategory;

  @Field(() => EventType, { nullable: true, description: 'Filter by event type' })
  @IsOptional()
  @IsEnum(EventType)
  type?: EventType;

  @Field(() => EventStatus, { nullable: true, description: 'Filter by event status' })
  @IsOptional()
  @IsEnum(EventStatus)
  status?: EventStatus;

  @Field({ nullable: true, description: 'Filter events starting after this date' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  startDate?: Date;

  @Field({ nullable: true, description: 'Filter events starting before this date' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endDate?: Date;

  @Field({ nullable: true, description: 'Filter by location name' })
  @IsOptional()
  @IsString()
  location?: string;

  @Field(() => [String], { nullable: true, description: 'Filter by tags' })
  @IsOptional()
  tags?: string[];

  @Field({ nullable: true, defaultValue: false, description: 'If true, only shows events with available spots' })
  @IsOptional()
  availableOnly?: boolean;

  @Field(() => Int, { nullable: true, defaultValue: 0, description: 'Number of items to skip' })
  @IsOptional()
  @IsInt()
  @Min(0)
  skip?: number;

  @Field(() => Int, { nullable: true, defaultValue: 20, description: 'Number of items to return' })
  @IsOptional()
  @IsInt()
  @Min(1)
  take?: number;

  @Field({ nullable: true, defaultValue: 'startDate', description: 'Field to sort by' })
  @IsOptional()
  @IsString()
  orderBy?: string;

  @Field({ nullable: true, defaultValue: 'asc', description: 'Sort direction (asc/desc)' })
  @IsOptional()
  @IsString()
  orderDirection?: 'asc' | 'desc';
}
