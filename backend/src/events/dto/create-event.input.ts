// backend/src/events/dto/create-event.input.ts
import { InputType, Field, Int, Float } from '@nestjs/graphql';
import {
  IsString,
  IsEnum,
  IsDate,
  IsInt,
  IsOptional,
  IsBoolean,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
// Import enums directly from Prisma instead of entity file
import { EventCategory, EventType } from '@prisma/client';

@InputType()
export class CreateEventInput {
  @Field()
  @IsString()
  title: string;

  @Field()
  @IsString()
  description: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  shortDescription?: string;

  @Field(() => EventCategory)
  @IsEnum(EventCategory)
  category: EventCategory;

  @Field(() => EventType)
  @IsEnum(EventType)
  type: EventType;

  @Field()
  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @Field()
  @IsDate()
  @Type(() => Date)
  endDate: Date;

  @Field({ nullable: true })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  registrationDeadline?: Date;

  @Field()
  @IsString()
  location: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  address?: string;

  @Field(() => Int)
  @IsInt()
  @Min(1)
  @Max(10000)
  maxParticipants: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @Min(0)
  price?: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @Min(0)
  memberPrice?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  tags?: string[];

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  requirements?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  additionalInfo?: string;

  @Field({ defaultValue: true })
  @IsBoolean()
  isPublic: boolean = true;

  @Field({ defaultValue: true })
  @IsBoolean()
  allowWaitlist: boolean = true;
}
