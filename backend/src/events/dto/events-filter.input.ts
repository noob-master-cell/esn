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
import {
  EventCategory,
  EventType,
  EventStatus,
} from '../entities/event.entity';

@InputType()
export class EventsFilterInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  search?: string;

  @Field(() => EventCategory, { nullable: true })
  @IsOptional()
  @IsEnum(EventCategory)
  category?: EventCategory;

  @Field(() => EventType, { nullable: true })
  @IsOptional()
  @IsEnum(EventType)
  type?: EventType;

  @Field(() => EventStatus, { nullable: true })
  @IsOptional()
  @IsEnum(EventStatus)
  status?: EventStatus;

  @Field({ nullable: true })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  startDate?: Date;

  @Field({ nullable: true })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endDate?: Date;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  location?: string;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  tags?: string[];

  @Field({ nullable: true, defaultValue: false })
  @IsOptional()
  availableOnly?: boolean;

  @Field(() => Int, { nullable: true, defaultValue: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  skip?: number;

  @Field(() => Int, { nullable: true, defaultValue: 20 })
  @IsOptional()
  @IsInt()
  @Min(1)
  take?: number;

  @Field({ nullable: true, defaultValue: 'startDate' })
  @IsOptional()
  @IsString()
  orderBy?: string;

  @Field({ nullable: true, defaultValue: 'asc' })
  @IsOptional()
  @IsString()
  orderDirection?: 'asc' | 'desc';
}
