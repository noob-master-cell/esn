// backend/src/registrations/entities/registration.entity.ts
import {
  ObjectType,
  Field,
  ID,
  Int,
  Float,
  registerEnumType,
} from '@nestjs/graphql';
import { User } from '../../users/entities/user.entity';
import { Event } from '../../events/entities/event.entity';

export enum RegistrationStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',

  CANCELLED = 'CANCELLED',
  ATTENDED = 'ATTENDED',
  NO_SHOW = 'NO_SHOW',
}

export enum RegistrationType {
  REGULAR = 'REGULAR',

  VIP = 'VIP',
  ORGANIZER = 'ORGANIZER',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
  CANCELLED = 'CANCELLED',
}

// Register enums for GraphQL
registerEnumType(RegistrationStatus, {
  name: 'RegistrationStatus',
  description: 'Registration status options',
});

registerEnumType(RegistrationType, {
  name: 'RegistrationType',
  description: 'Registration type options',
});

registerEnumType(PaymentStatus, {
  name: 'PaymentStatus',
  description: 'Payment status options',
});

@ObjectType()
export class Registration {
  @Field(() => ID)
  id: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  // Relations
  @Field(() => User)
  user: User;

  @Field()
  userId: string;

  @Field(() => Event)
  event: Event;

  @Field()
  eventId: string;

  // Registration Details
  @Field(() => RegistrationStatus)
  status: RegistrationStatus;

  @Field(() => RegistrationType)
  registrationType: RegistrationType;



  // Payment Information
  @Field()
  paymentRequired: boolean;

  @Field(() => PaymentStatus)
  paymentStatus: PaymentStatus;

  @Field(() => Float)
  amountDue: number;

  @Field()
  currency: string;

  // Additional Information
  @Field({ nullable: true })
  specialRequests?: string;

  @Field({ nullable: true })
  emergencyContact?: string;

  @Field({ nullable: true })
  dietary?: string;

  // Timestamps
  @Field()
  registeredAt: Date;

  @Field({ nullable: true })
  confirmedAt?: Date;

  @Field({ nullable: true })
  cancelledAt?: Date;
}
