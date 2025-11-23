// backend/src/registrations/dto/registration-filter.input.ts
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
  RegistrationStatus,
  RegistrationType,
  PaymentStatus,
} from '../entities/registration.entity';

@InputType()
export class RegistrationFilterInput {
  @Field(() => RegistrationStatus, { nullable: true })
  @IsOptional()
  @IsEnum(RegistrationStatus)
  status?: RegistrationStatus;

  @Field(() => RegistrationType, { nullable: true })
  @IsOptional()
  @IsEnum(RegistrationType)
  registrationType?: RegistrationType;

  @Field(() => PaymentStatus, { nullable: true })
  @IsOptional()
  @IsEnum(PaymentStatus)
  paymentStatus?: PaymentStatus;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  eventId?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  userId?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  registeredAfter?: Date;

  @Field({ nullable: true })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  registeredBefore?: Date;

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

  @Field({ nullable: true, defaultValue: 'registeredAt' })
  @IsOptional()
  @IsString()
  orderBy?: string;

  @Field({ nullable: true, defaultValue: 'desc' })
  @IsOptional()
  @IsString()
  orderDirection?: 'asc' | 'desc';
}
