import { Injectable } from '@nestjs/common';
import { PrismaService } from './../../prisma/prisma.service';
import { ClerkService } from '../clerk/clerk.service';
import { User } from '../users/entities/user.entity';
import { UserTransformer } from './../common/transformers/user.transformer';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private clerkService: ClerkService,
  ) {}

  async validateUser(clerkUserId: string): Promise<User | null> {
    try {
      // Sync user from Clerk to our database
      const dbUser = await this.clerkService.syncUserToDatabase(
        clerkUserId,
        this.prisma,
      );

      if (!dbUser || !dbUser.isActive) {
        return null;
      }

      return UserTransformer.fromPrisma(dbUser);
    } catch (error) {
      console.error('User validation failed:', error);
      return null;
    }
  }

  async getCurrentUser(clerkUserId: string): Promise<User | null> {
    const dbUser = await this.prisma.user.findUnique({
      where: { clerkId: clerkUserId, isActive: true },
    });

    if (!dbUser) {
      // Try to sync user if not found
      return this.validateUser(clerkUserId);
    }

    return UserTransformer.fromPrisma(dbUser);
  }
}
