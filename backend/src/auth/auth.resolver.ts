import { Resolver, Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '../users/entities/user.entity';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Query(() => User)
  @UseGuards(JwtAuthGuard)
  async me(@CurrentUser() user: User) {
    return user;
  }

  @Query(() => String)
  @UseGuards(JwtAuthGuard)
  async hello(@CurrentUser() user: User) {
    return `Hello ${user.firstName}! Your Clerk integration is working perfectly.`;
  }

  @Query(() => String)
  healthCheck() {
    return 'Backend is running with Clerk integration!';
  }
}
