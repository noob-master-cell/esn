import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { PrismaService } from '../prisma/prisma.service';
import { UsersFilterInput } from './dto/users-filter.input';
import { PaginatedUsers } from './dto/paginated-users.output';
import { Prisma } from '@prisma/client';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private cloudinaryService: CloudinaryService,
  ) { }

  async findAll(filter: UsersFilterInput = {}): Promise<PaginatedUsers> {
    const where: Prisma.UserWhereInput = {};

    if (filter.search) {
      where.OR = [
        { email: { contains: filter.search, mode: 'insensitive' } },
        { firstName: { contains: filter.search, mode: 'insensitive' } },
        { lastName: { contains: filter.search, mode: 'insensitive' } },
      ];
    }

    if (filter.role) {
      where.role = filter.role;
    }

    if (filter.isActive !== undefined) {
      where.isActive = filter.isActive;
    }

    if (filter.esnCardVerified !== undefined) {
      where.esnCardVerified = filter.esnCardVerified;
    }

    if (filter.university) {
      where.university = { contains: filter.university, mode: 'insensitive' };
    }

    const [items, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip: filter.skip || 0,
        take: filter.take || 20,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      items: items.map((user) => this.transformPrismaUser(user)),
      total,
    };
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

    // Cloudinary Cleanup: Delete old avatar if changed
    if (updateData.avatar !== undefined) {
      const oldAvatar = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { avatar: true },
      }).then(u => u?.avatar);

      // If there was an old avatar and it's different from the new one (or new one is null)
      if (oldAvatar && oldAvatar !== updateData.avatar) {
        const publicId = this.cloudinaryService.extractPublicIdFromUrl(oldAvatar);
        if (publicId) {
          this.cloudinaryService.deleteImage(publicId).catch(err =>
            console.error(`Failed to delete old avatar ${publicId}:`, err)
          );
        }
      }
    }

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
