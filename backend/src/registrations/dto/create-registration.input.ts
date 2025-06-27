// backend/src/registrations/dto/create-registration.input.ts
import { InputType, Field, ID } from '@nestjs/graphql';
import {
  IsString,
  IsOptional,
  IsEmail,
  MaxLength,
  MinLength,
} from 'class-validator';

@InputType()
export class CreateRegistrationInput {
  @Field(() => ID)
  @IsString()
  eventId: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  specialRequests?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  dietary?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MinLength(10)
  @MaxLength(100)
  emergencyContact?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsEmail()
  emergencyEmail?: string;
}
