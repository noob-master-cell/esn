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

import { UsersFilterInput } from './dto/users-filter.input';
import { PaginatedUsers } from './dto/paginated-users.output';

@Resolver(() => User)
export class UsersResolver {
  constructor(private usersService: UsersService) { }

  @Query(() => PaginatedUsers)
  @UseGuards(Auth0Guard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async users(
    @Args('filter', { nullable: true }) filter: UsersFilterInput = {},
  ) {
    return this.usersService.findAll(filter);
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

    return this.usersService.updateProfile(user.id, updateUserInput);
  }

  @Query(() => User)
  @UseGuards(Auth0Guard)
  async myProfile(@CurrentUser() user: User) {

    return this.usersService.findOne(user.id);
  }

  @Query(() => String)
  @UseGuards(Auth0Guard)
  async exportMyData(@CurrentUser() user: User) {
    const data = await this.usersService.exportUserData(user.id);
    return JSON.stringify(data);
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
