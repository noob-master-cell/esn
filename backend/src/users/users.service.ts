import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { PrismaService } from './../../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<User[]> {
    const prismaUsers = await this.prisma.user.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });

    return prismaUsers.map((user) => this.transformPrismaUser(user));
  }

  async findOne(id: string): Promise<User | null> {
    const prismaUser = await this.prisma.user.findUnique({
      where: { id, isActive: true },
    });

    if (!prismaUser) {
      return null;
    }

    return this.transformPrismaUser(prismaUser);
  }

  async findByEmail(email: string): Promise<User | null> {
    const prismaUser = await this.prisma.user.findUnique({
      where: { email, isActive: true },
    });

    if (!prismaUser) {
      return null;
    }

    return this.transformPrismaUser(prismaUser);
  }

  async updateProfile(userId: string, updateData: any): Promise<User> {
    const prismaUser = await this.prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    return this.transformPrismaUser(prismaUser);
  }

  // Helper method to transform Prisma user to GraphQL user
  transformPrismaUser(prismaUser: any): User {
    return {
      id: prismaUser.id,
      email: prismaUser.email,
      firstName: prismaUser.firstName,
      lastName: prismaUser.lastName,
      avatar: prismaUser.avatar || undefined,
      phone: prismaUser.phone || undefined,
      esnCardNumber: prismaUser.esnCardNumber || undefined,
      esnCardVerified: prismaUser.esnCardVerified,
      esnCardExpiry: prismaUser.esnCardExpiry || undefined,
      university: prismaUser.university || undefined,
      chapter: prismaUser.chapter || undefined,
      nationality: prismaUser.nationality || undefined,
      emailVerified: prismaUser.emailVerified,
      isActive: prismaUser.isActive,
      role: prismaUser.role,
      createdAt: prismaUser.createdAt,
      updatedAt: prismaUser.updatedAt,
      // Auth0 fields if available
      auth0Id: prismaUser.auth0Id,
      auth0Name: prismaUser.auth0Name,
      auth0Picture: prismaUser.auth0Picture,
    };
  }
}
