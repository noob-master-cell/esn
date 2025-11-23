import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { PrismaService } from './../../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) { }

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
      data: {
        firstName: updateData.firstName,
        lastName: updateData.lastName,
        phone: updateData.phone,
        university: updateData.university,
        nationality: updateData.nationality,
        avatar: updateData.avatar,
        chapter: updateData.chapter,
        bio: updateData.bio,
        telegram: updateData.telegram,
        instagram: updateData.instagram,
        esnCardNumber: updateData.esnCardNumber,
        emergencyContactName: updateData.emergencyContactName,
        emergencyContactPhone: updateData.emergencyContactPhone,
      },
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
      bio: prismaUser.bio || undefined,
      telegram: prismaUser.telegram || undefined,
      instagram: prismaUser.instagram || undefined,
      emergencyContactName: prismaUser.emergencyContactName || undefined,
      emergencyContactPhone: prismaUser.emergencyContactPhone || undefined,
      emailVerified: prismaUser.emailVerified,
      isActive: prismaUser.isActive,
      role: prismaUser.role,
      createdAt: prismaUser.createdAt,
      updatedAt: prismaUser.updatedAt,
    };
  }
  async verifyEsnCard(userId: string, verified: boolean): Promise<User> {
    const prismaUser = await this.prisma.user.update({
      where: { id: userId },
      data: { esnCardVerified: verified },
    });

    return this.transformPrismaUser(prismaUser);
  }

  async deleteUser(userId: string): Promise<boolean> {
    try {
      await this.prisma.user.delete({
        where: { id: userId },
      });
      return true;
    } catch (error) {
      console.error('Failed to delete user:', error);
      return false;
    }
  }


  async updateUserRole(userId: string, role: any): Promise<User> {
    const prismaUser = await this.prisma.user.update({
      where: { id: userId },
      data: { role },
    });
    return this.transformPrismaUser(prismaUser);
  }

  async adminDeleteUser(userId: string): Promise<boolean> {
    try {
      await this.prisma.user.delete({
        where: { id: userId },
      });
      return true;
    } catch (error) {
      console.error('Failed to delete user:', error);
      return false;
    }
  }
}
