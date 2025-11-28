import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@prisma/client';

/**
 * Decorator to specify the roles required to access a route or resolver.
 * 
 * Usage:
 * @Roles(UserRole.ADMIN)
 */
export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);
