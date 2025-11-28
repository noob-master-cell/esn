import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { UserRole } from '@prisma/client';

/**
 * Guard that checks if the authenticated user has the required roles.
 * 
 * It retrieves the required roles from the route metadata (set by @Roles decorator)
 * and compares them with the user's role.
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) { }

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      'roles',
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const ctx = GqlExecutionContext.create(context);
    const contextData = ctx.getContext();
    // Handle both HTTP requests (req) and Subscriptions (connection/extra)
    const req = contextData.req || contextData.connection?.context || contextData.extra?.request;
    const user = req?.user;

    return requiredRoles.some((role) => user?.role === role);
  }
}
