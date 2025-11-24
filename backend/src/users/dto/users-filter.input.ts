import { InputType, Field, Int } from '@nestjs/graphql';
import { IsOptional, IsString, IsBoolean, IsEnum, IsInt, Min } from 'class-validator';
import { UserRole } from '@prisma/client';

@InputType()
export class UsersFilterInput {
    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    search?: string;

    @Field(() => UserRole, { nullable: true })
    @IsOptional()
    @IsEnum(UserRole)
    role?: UserRole;

    @Field({ nullable: true })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

    @Field({ nullable: true })
    @IsOptional()
    @IsBoolean()
    esnCardVerified?: boolean;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    university?: string;

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
}
