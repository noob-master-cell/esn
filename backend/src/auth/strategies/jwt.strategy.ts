import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';
import { ClerkService } from '../../clerk/clerk.service';
import { PrismaService } from './../../../prisma/prisma.service';
import { UserTransformer } from '../../common/transformers/user.transformer';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private clerkService: ClerkService,
    private prismaService: PrismaService,
  ) {
    super();
  }

  async validate(req: any): Promise<any> {
    try {
      console.log('🔍 JWT Strategy: Custom validation started');

      // Extract token from Authorization header
      const authHeader = req.headers?.authorization;
      console.log('🔍 JWT Strategy: Auth header present:', !!authHeader);

      if (!authHeader) {
        console.log('❌ JWT Strategy: No authorization header');
        throw new UnauthorizedException('No authorization header');
      }

      const token = authHeader.replace('Bearer ', '');
      console.log('🔍 JWT Strategy: Token extracted, length:', token.length);

      if (!token) {
        console.log('❌ JWT Strategy: No token in header');
        throw new UnauthorizedException('No token provided');
      }

      // Verify token with Clerk
      console.log('🔍 JWT Strategy: Verifying with Clerk...');
      const clerkPayload = await this.clerkService.verifyToken(token);
      console.log(
        '✅ JWT Strategy: Clerk verification successful, user ID:',
        clerkPayload.sub,
      );

      // Sync user to database
      console.log('🔄 JWT Strategy: Syncing user to database...');
      const dbUser = await this.clerkService.syncUserToDatabase(
        clerkPayload.sub,
        this.prismaService,
      );

      if (!dbUser || !dbUser.isActive) {
        console.log('❌ JWT Strategy: User not found or inactive');
        throw new UnauthorizedException('User not found or inactive');
      }

      // Transform user for GraphQL
      console.log('✅ JWT Strategy: User validation successful:', dbUser.email);
      return UserTransformer.fromPrisma(dbUser);
    } catch (error) {
      console.error('❌ JWT Strategy validation failed:', error.message);
      throw new UnauthorizedException(
        `Authentication failed: ${error.message}`,
      );
    }
  }
}
