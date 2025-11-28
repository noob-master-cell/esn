import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '../users/entities/user.entity';
import { UserTransformer } from './../common/transformers/user.transformer';

/**
 * Service responsible for handling authentication-related logic.
 * Primarily used to validate users against Auth0 and retrieve user details.
 */
@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) { }

  /**
   * Validates a user based on their Auth0 ID.
   * Checks if the user exists in the database and is active.
   * 
   * @param auth0UserId - The unique identifier from Auth0.
   * @returns The user object if found and active, otherwise null.
   */
  async validateUser(auth0UserId: string): Promise<User | null> {
    try {
      const dbUser = await this.prisma.user.findUnique({
        where: { auth0Id: auth0UserId, isActive: true },
      });

      if (!dbUser) {
        return null;
      }

      return UserTransformer.fromPrisma(dbUser);
    } catch (error) {
      console.error('User validation failed:', error);
      return null;
    }
  }

  /**
   * Retrieves the current authenticated user.
   * Alias for `validateUser`.
   * 
   * @param auth0UserId - The unique identifier from Auth0.
   * @returns The user object if found and active, otherwise null.
   */
  async getCurrentUser(auth0UserId: string): Promise<User | null> {
    return this.validateUser(auth0UserId);
  }
}
