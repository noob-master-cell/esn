import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ClerkService } from '../../clerk/clerk.service';
import { PrismaService } from './../../../prisma/prisma.service';
import { UserTransformer } from '../../common/transformers/user.transformer';

@Injectable()
export class ClerkAuthGuard implements CanActivate {
  constructor(
    private clerkService: ClerkService,
    private prismaService: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      console.log('🔍 Clerk Auth Guard: Starting validation');

      // Get the request object (works for both HTTP and GraphQL)
      const ctx = GqlExecutionContext.create(context);
      const req = ctx.getContext().req;

      // Extract token from Authorization header
      const authHeader = req.headers?.authorization;
      console.log('🔍 Clerk Auth Guard: Auth header present:', !!authHeader);

      if (!authHeader) {
        console.log('❌ Clerk Auth Guard: No authorization header');
        throw new UnauthorizedException('No authorization header');
      }

      const token = authHeader.replace('Bearer ', '');
      console.log(
        '🔍 Clerk Auth Guard: Token extracted, length:',
        token.length,
      );

      if (!token) {
        console.log('❌ Clerk Auth Guard: No token in header');
        throw new UnauthorizedException('No token provided');
      }

      // Verify token with Clerk
      console.log('🔍 Clerk Auth Guard: Verifying with Clerk...');
      const clerkPayload = await this.clerkService.verifyToken(token);
      console.log(
        '✅ Clerk Auth Guard: Clerk verification successful, user ID:',
        clerkPayload.sub,
      );

      // Sync user to database
      console.log('🔄 Clerk Auth Guard: Syncing user to database...');
      const dbUser = await this.clerkService.syncUserToDatabase(
        clerkPayload.sub,
        this.prismaService,
      );

      if (!dbUser || !dbUser.isActive) {
        console.log('❌ Clerk Auth Guard: User not found or inactive');
        throw new UnauthorizedException('User not found or inactive');
      }

      // Transform user and attach to request
      const user = UserTransformer.fromPrisma(dbUser);
      req.user = user;

      console.log(
        '✅ Clerk Auth Guard: Authentication successful:',
        user.email,
      );
      return true;
    } catch (error) {
      console.log('❌ Clerk Auth Guard failed:', error.message);
      throw new UnauthorizedException(
        `Authentication failed: ${error.message}`,
      );
    }
  }
}
