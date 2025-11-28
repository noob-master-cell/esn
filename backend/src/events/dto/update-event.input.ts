import { CreateEventInput } from './create-event.input';
import { InputType, Field, PartialType, ID } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class UpdateEventInput extends PartialType(CreateEventInput) {
  @Field(() => ID, { description: 'Unique identifier of the event to update' })
  @IsString()
  id: string;
}
