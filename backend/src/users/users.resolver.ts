import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { UpdateUserInput } from './dto/update-user.input';
import { Auth0Guard } from '../auth/guards/auth0.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '@prisma/client';

@Resolver(() => User)
export class UsersResolver {
  constructor(private usersService: UsersService) { }

  @Query(() => [User])
  @UseGuards(Auth0Guard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async users() {
    return this.usersService.findAll();
  }

  @Query(() => User, { nullable: true })
  @UseGuards(Auth0Guard)
  async user(@Args('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Mutation(() => User)
  @UseGuards(Auth0Guard)
  async updateUserProfile(
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
    @CurrentUser() user: User,
  ) {
    console.log(
      '🔄 Users Resolver: Update profile mutation called by:',
      user.email,
    );
    return this.usersService.updateProfile(user.id, updateUserInput);
  }

  @Query(() => User)
  @UseGuards(Auth0Guard)
  async myProfile(@CurrentUser() user: User) {
    console.log('👤 Users Resolver: Get my profile query for:', user.email);
    return this.usersService.findOne(user.id);
  }
  @Mutation(() => User)
  @UseGuards(Auth0Guard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async verifyEsnCard(
    @Args('userId') userId: string,
    @Args('verified') verified: boolean,
  ) {
    return this.usersService.verifyEsnCard(userId, verified);
  }

  @Mutation(() => Boolean)
  @UseGuards(Auth0Guard)
  async deleteUser(@CurrentUser() user: User) {
    console.log('🗑️ Users Resolver: Delete user mutation called by:', user.email);
    return this.usersService.deleteUser(user.id);
  }



  @Mutation(() => User)
  @UseGuards(Auth0Guard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async updateUserRole(
    @Args('userId') userId: string,
    @Args('role', { type: () => UserRole }) role: UserRole,
  ) {
    return this.usersService.updateUserRole(userId, role);
  }

  @Mutation(() => Boolean)
  @UseGuards(Auth0Guard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async adminDeleteUser(@Args('userId') userId: string) {
    return this.usersService.adminDeleteUser(userId);
  }
}
