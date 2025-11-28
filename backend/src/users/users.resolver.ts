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

/**
 * Resolver for handling User-related GraphQL operations.
 * Manages user profile retrieval, updates, and administrative actions.
 */
@Resolver(() => User)
export class UsersResolver {
  constructor(private usersService: UsersService) { }

  /**
   * Retrieves a paginated list of users.
   * Restricted to Admin users.
   * 
   * @param filter - Filtering criteria (search, role, etc.).
   * @returns Paginated list of users.
   */
  @Query(() => PaginatedUsers)
  @UseGuards(Auth0Guard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async users(
    @Args('filter', { nullable: true }) filter: UsersFilterInput = {},
  ) {
    return this.usersService.findAll(filter);
  }

  /**
   * Retrieves a single user by ID.
   * Requires authentication.
   * 
   * @param id - User ID.
   * @returns The requested user.
   */
  @Query(() => User, { nullable: true })
  @UseGuards(Auth0Guard)
  async user(@Args('id') id: string) {
    return this.usersService.findOne(id);
  }

  /**
   * Updates the current user's profile.
   * Requires authentication.
   * 
   * @param updateUserInput - Data to update.
   * @param user - The currently authenticated user.
   * @returns The updated user.
   */
  @Mutation(() => User)
  @UseGuards(Auth0Guard)
  async updateUserProfile(
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
    @CurrentUser() user: User,
  ) {
    return this.usersService.updateProfile(user.id, updateUserInput);
  }

  /**
   * Retrieves the current user's profile.
   * Requires authentication.
   * 
   * @param user - The currently authenticated user.
   * @returns The current user.
   */
  @Query(() => User)
  @UseGuards(Auth0Guard)
  async myProfile(@CurrentUser() user: User) {
    return this.usersService.findOne(user.id);
  }

  /**
   * Exports all data associated with the current user (GDPR compliance).
   * Requires authentication.
   * 
   * @param user - The currently authenticated user.
   * @returns JSON string containing all user data.
   */
  @Query(() => String)
  @UseGuards(Auth0Guard)
  async exportMyData(@CurrentUser() user: User) {
    const data = await this.usersService.exportUserData(user.id);
    return JSON.stringify(data);
  }

  /**
   * Verifies or un-verifies a user's ESN card.
   * Restricted to Admin users.
   * 
   * @param userId - ID of the user.
   * @param verified - Verification status.
   * @returns The updated user.
   */
  @Mutation(() => User)
  @UseGuards(Auth0Guard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async verifyEsnCard(
    @Args('userId') userId: string,
    @Args('verified') verified: boolean,
  ) {
    return this.usersService.verifyEsnCard(userId, verified);
  }

  /**
   * Deletes the current user's account.
   * Requires authentication.
   * 
   * @param user - The currently authenticated user.
   * @returns True if deletion was successful.
   */
  @Mutation(() => Boolean)
  @UseGuards(Auth0Guard)
  async deleteUser(@CurrentUser() user: User) {
    return this.usersService.deleteUser(user.id);
  }

  /**
   * Updates a user's role.
   * Restricted to Admin users.
   * 
   * @param userId - ID of the user.
   * @param role - New role.
   * @returns The updated user.
   */
  @Mutation(() => User)
  @UseGuards(Auth0Guard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async updateUserRole(
    @Args('userId') userId: string,
    @Args('role', { type: () => UserRole }) role: UserRole,
  ) {
    return this.usersService.updateUserRole(userId, role);
  }

  /**
   * Administratively deletes a user account.
   * Restricted to Admin users.
   * 
   * @param userId - ID of the user to delete.
   * @returns True if deletion was successful.
   */
  @Mutation(() => Boolean)
  @UseGuards(Auth0Guard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async adminDeleteUser(@Args('userId') userId: string) {
    return this.usersService.adminDeleteUser(userId);
  }
}
