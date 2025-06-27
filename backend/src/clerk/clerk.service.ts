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

    console.log('🔧 Clerk Service: Secret key present:', !!this.secretKey);
    console.log(
      '🔧 Clerk Service: Secret key starts with sk_test:',
      this.secretKey?.startsWith('sk_test_'),
    );

    if (!this.secretKey) {
      throw new Error('CLERK_SECRET_KEY environment variable is required');
    }

    // Create Clerk client for user operations
    this.clerkClient = createClerkClient({ secretKey: this.secretKey });
    console.log('✅ Clerk Service: Client created successfully');
  }

  async verifyToken(token: string): Promise<ClerkTokenPayload> {
    try {
      console.log('🔍 Clerk Service: Verifying JWT token (networkless)...');
      console.log(
        '🔍 Clerk Service: Token preview:',
        token.substring(0, 30) + '...',
      );

      // Use networkless JWT verification (modern approach)
      const payload = await verifyToken(token, {
        secretKey: this.secretKey,
      });

      console.log('✅ Clerk Service: JWT verified successfully');
      console.log('✅ Clerk Service: User ID:', payload.sub);
      console.log('✅ Clerk Service: Session ID:', payload.sid);

      return payload as ClerkTokenPayload;
    } catch (error) {
      console.error('❌ Clerk Service: JWT verification failed');
      console.error('❌ Error type:', error.constructor.name);
      console.error('❌ Error message:', error.message);
      console.error('❌ Full error details:', error);
      throw new Error(`Token verification failed: ${error.message}`);
    }
  }

  async getUser(userId: string): Promise<ClerkUser> {
    try {
      console.log('🔍 Clerk Service: Getting user from Clerk:', userId);
      const user = await this.clerkClient.users.getUser(userId);
      console.log(
        '✅ Clerk Service: User retrieved:',
        user.emailAddresses[0]?.emailAddress,
      );
      return user as ClerkUser;
    } catch (error) {
      console.error('❌ Clerk Service: Failed to get user:', error.message);
      throw new Error(`Failed to get user: ${error.message}`);
    }
  }

  async syncUserToDatabase(
    clerkUserId: string,
    prismaService: any,
  ): Promise<any> {
    try {
      console.log('🔄 Clerk Service: Starting user sync for:', clerkUserId);

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
        console.log('🆕 Clerk Service: Creating new user in database');
        dbUser = await prismaService.user.create({
          data: userData,
        });
        console.log('✅ Clerk Service: User created:', dbUser.email);
      } else {
        console.log('🔄 Clerk Service: Updating existing user');
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
        console.log('✅ Clerk Service: User updated:', dbUser.email);
      }

      return dbUser;
    } catch (error) {
      console.error('❌ Clerk Service: User sync failed:', error.message);
      throw new Error(`User sync failed: ${error.message}`);
    }
  }
}
