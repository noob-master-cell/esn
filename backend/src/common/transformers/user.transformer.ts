import { User } from '../../users/entities/user.entity';

export class UserTransformer {
  static fromPrisma(prismaUser: any): User {
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
    };
  }
}
