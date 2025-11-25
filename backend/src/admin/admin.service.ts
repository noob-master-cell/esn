import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AdminStats } from './dto/admin-stats.output';

@Injectable()
export class AdminService {
    constructor(private prisma: PrismaService) { }

    async getStats(): Promise<AdminStats> {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        // Total counts
        const totalEvents = await this.prisma.event.count();
        const activeUsers = await this.prisma.user.count({
            where: { isActive: true },
        });
        const totalRegistrations = await this.prisma.registration.count();

        // Revenue calculation (sum of all completed payments)
        const revenueResult = await this.prisma.payment.aggregate({
            _sum: {
                amount: true,
            },
            where: {
                status: 'COMPLETED',
            },
        });
        const totalRevenue = Number(revenueResult._sum.amount) || 0;

        // Monthly stats
        const eventsThisMonth = await this.prisma.event.count({
            where: {
                createdAt: {
                    gte: startOfMonth,
                },
            },
        });

        const registrationsThisMonth = await this.prisma.registration.count({
            where: {
                registeredAt: {
                    gte: startOfMonth,
                },
            },
        });

        const monthlyRevenueResult = await this.prisma.payment.aggregate({
            _sum: {
                amount: true,
            },
            where: {
                status: 'COMPLETED',
                createdAt: {
                    gte: startOfMonth,
                },
            },
        });
        const revenueThisMonth = Number(monthlyRevenueResult._sum.amount) || 0;

        return {
            totalEvents,
            activeUsers,
            totalRegistrations,
            totalRevenue,
            eventsThisMonth,
            registrationsThisMonth,
            revenueThisMonth,
        };
    }
}
