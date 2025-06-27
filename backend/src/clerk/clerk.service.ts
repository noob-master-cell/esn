import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClerkClient, verifyToken } from '@clerk/backend';

interface ClerkTokenPayload {
  sub: string;
  sid?: string;
  iat?: number;
  exp?: number;
  [key: string]: any;
}

interface ClerkUser {
  id: string;
  emailAddresses: Array<{
    emailAddress: string;
    verification?: { status: string };
  }>;
  firstName?: string;
  lastName?: string;
  imageUrl?: string;
  phoneNumbers?: Array<{ phoneNumber: string }>;
  publicMetadata?: { [key: string]: any };
}

@Injectable()
export class ClerkService {
  private clerkClient: any;
  private secretKey: string;

  constructor(private configService: ConfigService) {
    this.secretKey = this.configService.get<string>('CLERK_SECRET_KEY');

    if (!this.secretKey) {
      throw new Error('CLERK_SECRET_KEY environment variable is required');
    }

    // Create Clerk client for user operations
    this.clerkClient = createClerkClient({ secretKey: this.secretKey });
  }

  async verifyToken(token: string): Promise<ClerkTokenPayload> {
    try {
      // Use networkless JWT verification (modern approach)
      const payload = await verifyToken(token, {
        secretKey: this.secretKey,
      });

      return payload as ClerkTokenPayload;
    } catch (error) {
      throw new Error(`Token verification failed: ${error.message}`);
    }
  }

  async getUser(userId: string): Promise<ClerkUser> {
    try {
      const user = await this.clerkClient.users.getUser(userId);
      return user as ClerkUser;
    } catch (error) {
      throw new Error(`Failed to get user: ${error.message}`);
    }
  }

  async syncUserToDatabase(
    clerkUserId: string,
    prismaService: any,
  ): Promise<any> {
    try {
      // Get user from Clerk
      const clerkUser = await this.getUser(clerkUserId);

      // Check if user exists in our database
      let dbUser = await prismaService.user.findUnique({
        where: { clerkId: clerkUserId },
      });

      const userData = {
        clerkId: clerkUserId,
        email: clerkUser.emailAddresses[0]?.emailAddress || '',
        firstName: clerkUser.firstName || '',
        lastName: clerkUser.lastName || '',
        avatar: clerkUser.imageUrl,
        emailVerified:
          clerkUser.emailAddresses[0]?.verification?.status === 'verified',
        phone: clerkUser.phoneNumbers?.[0]?.phoneNumber,
        university: clerkUser.publicMetadata?.university as string,
        nationality: clerkUser.publicMetadata?.nationality as string,
      };

      if (!dbUser) {
        dbUser = await prismaService.user.create({
          data: userData,
        });
      } else {
        dbUser = await prismaService.user.update({
          where: { clerkId: clerkUserId },
          data: {
            email: userData.email || dbUser.email,
            firstName: userData.firstName || dbUser.firstName,
            lastName: userData.lastName || dbUser.lastName,
            avatar: userData.avatar || dbUser.avatar,
            emailVerified: userData.emailVerified,
            phone: userData.phone || dbUser.phone,
          },
        });
      }

      return dbUser;
    } catch (error) {
      throw new Error(`User sync failed: ${error.message}`);
    }
  }
}