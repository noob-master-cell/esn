// backend/src/registrations/dto/create-registration.input.ts
import { InputType, Field, ID } from '@nestjs/graphql';
import {
  IsString,
  IsOptional,
  IsEmail,
  MaxLength,
  MinLength,
  IsEnum,
} from 'class-validator';
import { RegistrationType } from '../entities/registration.entity';

@InputType()
export class CreateRegistrationInput {
  @Field(() => ID)
  @IsString()
  eventId: string;

  @Field(() => RegistrationType, {
    nullable: true,
    description:
      'The type of registration (e.g., REGULAR). If not provided, it will be determined by the service.',
  })
  @IsOptional()
  @IsEnum(RegistrationType)
  registrationType?: RegistrationType;

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
