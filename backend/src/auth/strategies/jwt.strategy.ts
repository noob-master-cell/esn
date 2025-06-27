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
      // Extract token from Authorization header
      const authHeader = req.headers?.authorization;

      if (!authHeader) {
        throw new UnauthorizedException('No authorization header');
      }

      const token = authHeader.replace('Bearer ', '');

      if (!token) {
        throw new UnauthorizedException('No token provided');
      }

      // Verify token with Clerk
      const clerkPayload = await this.clerkService.verifyToken(token);

      // Sync user to database
      const dbUser = await this.clerkService.syncUserToDatabase(
        clerkPayload.sub,
        this.prismaService,
      );

      if (!dbUser || !dbUser.isActive) {
        throw new UnauthorizedException('User not found or inactive');
      }

      // Transform user for GraphQL
      return UserTransformer.fromPrisma(dbUser);
    } catch (error) {
      throw new UnauthorizedException(
        `Authentication failed: ${error.message}`,
      );
    }
  }
}