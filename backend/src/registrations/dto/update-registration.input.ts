// backend/src/registrations/dto/update-registration.input.ts
import { InputType, Field, ID, PartialType } from '@nestjs/graphql';
import { IsString, IsEnum, IsOptional } from 'class-validator';
import { CreateRegistrationInput } from './create-registration.input';
import { RegistrationStatus, PaymentStatus } from '../entities/registration.entity';

@InputType()
export class UpdateRegistrationInput extends PartialType(CreateRegistrationInput) {
  @Field(() => ID)
  @IsString()
  id: string;

  @Field(() => RegistrationStatus, { nullable: true })
  @IsOptional()
  @IsEnum(RegistrationStatus)
  status?: RegistrationStatus;

  @Field(() => PaymentStatus, { nullable: true })
  @IsOptional()
  @IsEnum(PaymentStatus)
  paymentStatus?: PaymentStatus;
}