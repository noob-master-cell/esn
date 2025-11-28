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
  IsArray,
  ArrayMaxSize,
} from 'class-validator';
import { Type } from 'class-transformer';
// Import enums directly from Prisma instead of entity file
import { EventCategory, EventType, EventStatus } from '@prisma/client';

@InputType()
export class CreateEventInput {
  @Field({ description: 'The title of the event' })
  @IsString()
  title: string;

  @Field({ description: 'Full description of the event' })
  @IsString()
  description: string;

  @Field({ nullable: true, description: 'Short summary for list views' })
  @IsOptional()
  @IsString()
  shortDescription?: string;

  @Field(() => EventCategory, { description: 'Category of the event' })
  @IsEnum(EventCategory)
  category: EventCategory;

  @Field(() => EventType, { description: 'Type of the event (e.g., WORKSHOP, SOCIAL)' })
  @IsEnum(EventType)
  type: EventType;

  @Field({ description: 'Date and time when the event starts' })
  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @Field({ description: 'Date and time when the event ends' })
  @IsDate()
  @Type(() => Date)
  endDate: Date;

  @Field({ nullable: true, description: 'Deadline for registration' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  registrationDeadline?: Date;

  @Field({ description: 'Name of the location' })
  @IsString()
  location: string;

  @Field({ nullable: true, description: 'Physical address of the location' })
  @IsOptional()
  @IsString()
  address?: string;

  @Field(() => Int, { description: 'Maximum number of participants allowed' })
  @IsInt()
  @Min(1)
  @Max(10000)
  maxParticipants: number;

  @Field(() => Float, { nullable: true, description: 'Price for non-members' })
  @IsOptional()
  @Min(0)
  price?: number;

  @Field(() => Float, { nullable: true, description: 'Price for ESN members' })
  @IsOptional()
  @Min(0)
  memberPrice?: number;

  @Field(() => [String], { defaultValue: [], description: 'List of image URLs' })
  @IsArray()
  @ArrayMaxSize(5)
  images: string[] = [];

  @Field(() => [String], { nullable: true, description: 'Tags for categorization' })
  @IsOptional()
  tags?: string[];

  @Field({ nullable: true, description: 'Special requirements for participants' })
  @IsOptional()
  @IsString()
  requirements?: string;

  @Field({ nullable: true, description: 'Additional information' })
  @IsOptional()
  @IsString()
  additionalInfo?: string;

  @Field({ defaultValue: true, description: 'Whether the event is visible to everyone' })
  @IsBoolean()
  isPublic: boolean = true;

  @Field({ defaultValue: false, description: 'If true, ignores maxParticipants limit' })
  @IsBoolean()
  @IsOptional()
  isUnlimited: boolean = false;

  @Field(() => EventStatus, { nullable: true, description: 'Initial status of the event' })
  @IsOptional()
  @IsEnum(EventStatus)
  status?: EventStatus;
}
