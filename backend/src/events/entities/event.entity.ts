// backend/src/events/entities/event.entity.ts
import {
  ObjectType,
  Field,
  ID,
  Int,
  Float,
  registerEnumType,
} from '@nestjs/graphql';
import { User } from '../../users/entities/user.entity';
// Import enums from Prisma instead of defining our own
import { EventStatus, EventCategory, EventType } from '@prisma/client';

// Register Prisma enums for GraphQL
registerEnumType(EventStatus, {
  name: 'EventStatus',
  description: 'Event status options',
});

registerEnumType(EventCategory, {
  name: 'EventCategory',
  description: 'Event category options',
});

registerEnumType(EventType, {
  name: 'EventType',
  description: 'Event type options',
});

@ObjectType()
export class Event {
  @Field(() => ID)
  id: string;

  @Field()
  title: string;

  @Field()
  description: string;

  @Field({ nullable: true })
  shortDescription?: string;

  @Field(() => EventCategory, { nullable: true })
  category?: EventCategory;

  @Field(() => EventType, { nullable: true })
  type?: EventType;

  @Field(() => EventStatus, { nullable: true })
  status?: EventStatus;

  @Field()
  startDate: Date;

  @Field({ nullable: true })
  endDate?: Date;

  @Field({ nullable: true })
  registrationDeadline?: Date;

  @Field({ nullable: true })
  location?: string;

  @Field({ nullable: true })
  address?: string;

  @Field(() => Int)
  maxParticipants: number;

  @Field(() => Float, { nullable: true })
  price?: number;

  @Field(() => Float, { nullable: true })
  memberPrice?: number;

  @Field(() => [String], { nullable: true })
  images: string[];

  @Field(() => [String], { nullable: true })
  tags?: string[];

  @Field({ nullable: true })
  requirements?: string;

  @Field({ nullable: true })
  additionalInfo?: string;

  @Field()
  isPublic: boolean;



  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  // Relations
  @Field(() => User)
  organizer: User;

  @Field()
  organizerId: string;

  // Computed fields
  @Field(() => Int)
  registrationCount: number;

  @Field(() => Int, { nullable: true })
  confirmedCount?: number;

  @Field(() => Int, { nullable: true })
  pendingCount?: number;

  @Field(() => Int, { nullable: true })
  cancelledCount?: number;



  @Field(() => Boolean, { nullable: true })
  isRegistered?: boolean; // For current user

  @Field(() => Boolean, { nullable: true })
  canRegister?: boolean; // For current user

  @Field(() => [User], { nullable: true })
  attendees?: User[];
}
