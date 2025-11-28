import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { PrismaService } from '../prisma/prisma.service';
import { UsersFilterInput } from './dto/users-filter.input';
import { PaginatedUsers } from './dto/paginated-users.output';
import { Prisma } from '@prisma/client';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

/**
 * Service responsible for managing users.
 * Handles user retrieval, profile updates, and administrative actions.
 */
@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private cloudinaryService: CloudinaryService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) { }

  /**
   * Retrieves a paginated list of users based on filters.
   * 
   * @param filter - Filtering criteria (search, role, status, etc.).
   * @returns Paginated list of users.
   */
  async findAll(filter: UsersFilterInput = {}): Promise<PaginatedUsers> {
    const cacheKey = `users:list:${JSON.stringify(filter)}`;
    const cached = await this.cacheManager.get<PaginatedUsers>(cacheKey);

    if (cached) {
      return cached;
    }

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

    const result = {
      items: items.map((user) => this.transformPrismaUser(user)),
      total,
    };

    await this.cacheManager.set(cacheKey, result, 30000);

    return result;
  }

  /**
   * Retrieves a single user by ID.
   * 
   * @param id - User ID.
   * @returns The user object or null if not found.
   */
  async findOne(id: string): Promise<User | null> {
    const prismaUser = await this.prisma.user.findUnique({
      where: { id, isActive: true },
    });

    if (!prismaUser) {
      return null;
    }

    return this.transformPrismaUser(prismaUser);
  }

  /**
   * Retrieves a user by email address.
   * 
   * @param email - User email.
   * @returns The user object or null if not found.
   */
  async findByEmail(email: string): Promise<User | null> {
    const prismaUser = await this.prisma.user.findUnique({
      where: { email, isActive: true },
    });

    if (!prismaUser) {
      return null;
    }

    return this.transformPrismaUser(prismaUser);
  }

  /**
   * Updates a user's profile information.
   * 
   * @param userId - ID of the user to update.
   * @param updateData - Data to update.
   * @returns The updated user.
   */
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

    if (updateData.avatar !== undefined) {
      const oldAvatar = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { avatar: true },
      }).then(u => u?.avatar);

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

  /**
   * Transforms a Prisma user object into the GraphQL User type.
   * 
   * @param prismaUser - Raw Prisma user object.
   * @returns Transformed user object.
   */
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

  /**
   * Verifies or un-verifies a user's ESN card.
   * 
   * @param userId - User ID.
   * @param verified - Verification status.
   * @returns The updated user.
   */
  async verifyEsnCard(userId: string, verified: boolean): Promise<User> {
    const prismaUser = await this.prisma.user.update({
      where: { id: userId },
      data: { esnCardVerified: verified },
    });

    return this.transformPrismaUser(prismaUser);
  }

  /**
   * Deletes a user account.
   * 
   * @param userId - User ID.
   * @returns True if deletion was successful.
   */
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

  /**
   * Updates a user's role.
   * 
   * @param userId - User ID.
   * @param role - New role.
   * @returns The updated user.
   */
  async updateUserRole(userId: string, role: any): Promise<User> {
    const prismaUser = await this.prisma.user.update({
      where: { id: userId },
      data: { role },
    });
    return this.transformPrismaUser(prismaUser);
  }

  /**
   * Administratively deletes a user.
   * 
   * @param userId - User ID.
   * @returns True if deletion was successful.
   */
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

  /**
   * Exports all data associated with a user (GDPR compliance).
   * 
   * @param userId - User ID.
   * @returns Object containing all user data.
   * @throws Error if user is not found.
   */
  async exportUserData(userId: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        preferences: true,
        registrations: {
          include: {
            event: true,
            payments: true,
          },
        },
        comments: true,
        feedbacks: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const exportData = {
      profile: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        university: user.university,
        nationality: user.nationality,
        chapter: user.chapter,
        esnCardNumber: user.esnCardNumber,
        esnCardVerified: user.esnCardVerified,
        bio: user.bio,
        socialMedia: {
          telegram: user.telegram,
          instagram: user.instagram,
        },
        emergencyContact: {
          name: user.emergencyContactName,
          phone: user.emergencyContactPhone,
        },
        joinedAt: user.createdAt,
      },
      preferences: user.preferences ? {
        language: user.preferences.language,
        timezone: user.preferences.timezone,
      } : null,
      registrations: user.registrations.map(reg => ({
        event: {
          title: reg.event.title,
          startDate: reg.event.startDate,
          endDate: reg.event.endDate,
          location: reg.event.location,
        },
        status: reg.status,
        registeredAt: reg.registeredAt,
        paymentStatus: reg.paymentStatus,
        amountDue: reg.amountDue,
        payments: reg.payments.map(p => ({
          amount: p.amount,
          currency: p.currency,
          status: p.status,
          method: p.method,
          date: p.createdAt,
        })),
      })),
      comments: user.comments.map(c => ({
        content: c.content,
        date: c.createdAt,
        eventId: c.eventId,
      })),
      feedback: user.feedbacks.map(f => ({
        message: f.message,
        type: f.type,
        date: f.createdAt,
      })),
    };

    return exportData;
  }
}
