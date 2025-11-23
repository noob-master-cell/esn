import { Resolver, Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '../users/entities/user.entity';
import { Auth0Guard } from './guards/auth0.guard';
import { CurrentUser } from './decorators/current-user.decorator';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) { }

  @Query(() => User)
  @UseGuards(Auth0Guard)
  async me(@CurrentUser() user: User) {
    return user;
  }

  @Query(() => String)
  @UseGuards(Auth0Guard)
  async hello(@CurrentUser() user: User) {
    return `Hello ${user.firstName}! Your Auth0 integration is working perfectly.`;
  }

  @Query(() => String)
  healthCheck() {
    return 'Backend is running with Auth0 integration!';
  }
}
