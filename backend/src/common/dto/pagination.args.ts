import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsOptional, IsString, IsInt, Min } from 'class-validator';

@ArgsType()
export class PaginationArgs {
    @Field(() => Int, { nullable: true })
    @IsOptional()
    @IsInt()
    @Min(1)
    first?: number;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    after?: string;

    @Field(() => Int, { nullable: true })
    @IsOptional()
    @IsInt()
    @Min(1)
    last?: number;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    before?: string;
}
