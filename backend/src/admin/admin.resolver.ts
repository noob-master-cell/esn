import { Resolver, Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminStats } from './dto/admin-stats.output';
import { RegistrationStats } from './dto/registration-stats.output';
import { Auth0Guard } from '../auth/guards/auth0.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Resolver()
export class AdminResolver {
    constructor(private readonly adminService: AdminService) { }

    @Query(() => AdminStats)
    @UseGuards(Auth0Guard, RolesGuard)
    @Roles(UserRole.ADMIN)
    async adminStats() {
        return this.adminService.getStats();
    }

    @Query(() => RegistrationStats)
    @UseGuards(Auth0Guard, RolesGuard)
    @Roles(UserRole.ADMIN)
    async registrationStats() {
        return this.adminService.getRegistrationStats();
    }
}
