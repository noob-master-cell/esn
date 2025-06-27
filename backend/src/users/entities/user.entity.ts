import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { UserRole } from '@prisma/client';

registerEnumType(UserRole, {
  name: 'UserRole',
});

@ObjectType()
export class User {
  @Field(() => ID)
  id: string;

  @Field()
  email: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field({ nullable: true })
  avatar?: string;

  @Field({ nullable: true })
  phone?: string;

  @Field({ nullable: true })
  esnCardNumber?: string;

  @Field()
  esnCardVerified: boolean;

  @Field({ nullable: true })
  esnCardExpiry?: Date;

  @Field({ nullable: true })
  university?: string;

  @Field({ nullable: true })
  chapter?: string;

  @Field({ nullable: true })
  nationality?: string;

  @Field()
  emailVerified: boolean;

  @Field()
  isActive: boolean;

  @Field(() => UserRole)
  role: UserRole;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}