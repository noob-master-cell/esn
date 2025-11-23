import { Injectable } from '@nestjs/common';
import { PrismaService } from './../../prisma/prisma.service';
import { User } from '../users/entities/user.entity';
import { UserTransformer } from './../common/transformers/user.transformer';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) { }

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

  async getCurrentUser(auth0UserId: string): Promise<User | null> {
    return this.validateUser(auth0UserId);
  }
}
