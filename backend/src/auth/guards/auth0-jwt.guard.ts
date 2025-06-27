import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class Auth0JwtGuard extends AuthGuard('auth0-jwt') {
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;

    console.log('🔒 Auth0JwtGuard - Processing request');
    console.log('  Request type:', context.getType());
    console.log('  Has Authorization header:', !!request.headers.authorization);

    if (request.headers.authorization) {
      console.log(
        '  Authorization header preview:',
        request.headers.authorization.substring(0, 50) + '...',
      );
    } else {
      console.log('  Available headers:', Object.keys(request.headers));
    }

    return request;
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    console.log('🔒 Auth0JwtGuard - Handle request result:');
    console.log('  Error present:', !!err);
    console.log('  User found:', !!user);
    console.log('  Info present:', !!info);

    if (err) {
      console.error('❌ Auth0 JWT Guard Error Details:');
      console.error('  Error type:', err.constructor?.name);
      console.error('  Error message:', err.message);
      console.error('  Error stack:', err.stack);
    }

    if (info) {
      console.error('❌ Auth0 JWT Info Details:');
      console.error('  Info type:', typeof info);
      console.error('  Info content:', info);

      if (typeof info === 'object') {
        console.error('  Info keys:', Object.keys(info));
        console.error('  Info message:', info.message);
        console.error('  Info name:', info.name);
      }
    }

    if (user) {
      console.log('✅ Auth0 JWT validation successful');
      console.log('  User ID:', user.id);
      console.log('  User email:', user.email);
      return user;
    } else {
      console.error('❌ Auth0 JWT validation failed - no user returned');
      return null; // Return null for optional auth
    }
  }
}
