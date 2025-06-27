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

  static fromClerkUser(clerkUser: any, dbUser?: any): User {
    return {
      id: dbUser?.id || clerkUser.id,
      email: clerkUser.emailAddresses[0]?.emailAddress || '',
      firstName: clerkUser.firstName || '',
      lastName: clerkUser.lastName || '',
      avatar: clerkUser.imageUrl || undefined,
      phone: clerkUser.phoneNumbers[0]?.phoneNumber || undefined,
      esnCardNumber: dbUser?.esnCardNumber || undefined,
      esnCardVerified: dbUser?.esnCardVerified || false,
      esnCardExpiry: dbUser?.esnCardExpiry || undefined,
      university:
        clerkUser.publicMetadata?.university || dbUser?.university || undefined,
      chapter: dbUser?.chapter || undefined,
      nationality:
        clerkUser.publicMetadata?.nationality ||
        dbUser?.nationality ||
        undefined,
      emailVerified:
        clerkUser.emailAddresses[0]?.verification?.status === 'verified',
      isActive: dbUser?.isActive ?? true,
      role: dbUser?.role || 'USER',
      createdAt: dbUser?.createdAt || new Date(),
      updatedAt: dbUser?.updatedAt || new Date(),
    };
  }
}
