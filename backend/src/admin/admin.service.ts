import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AdminStats } from './dto/admin-stats.output';

@Injectable()
export class AdminService {
    constructor(private prisma: PrismaService) { }

    async getStats(): Promise<AdminStats> {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

        // Execute all independent queries in parallel
        const [
            totalEvents,
            activeUsers,
            totalRegistrations,
            revenueResult,
            eventsThisMonth,
            registrationsThisMonth,
            monthlyRevenueResult,
            eventsLastMonth,
            registrationsLastMonth,
            lastMonthRevenueResult,
            usersThisMonth,
            usersLastMonth
        ] = await Promise.all([
            // Total counts
            this.prisma.event.count(),
            this.prisma.user.count({ where: { isActive: true } }),
            this.prisma.registration.count({ where: { status: { not: 'CANCELLED' } } }),

            // Total Revenue
            this.prisma.payment.aggregate({
                _sum: { amount: true },
                where: { status: 'COMPLETED' },
            }),

            // Monthly stats
            this.prisma.event.count({ where: { createdAt: { gte: startOfMonth } } }),
            this.prisma.registration.count({
                where: {
                    registeredAt: { gte: startOfMonth },
                    status: { not: 'CANCELLED' },
                },
            }),
            this.prisma.payment.aggregate({
                _sum: { amount: true },
                where: { status: 'COMPLETED', createdAt: { gte: startOfMonth } },
            }),

            // Previous Month Stats
            this.prisma.event.count({
                where: { createdAt: { gte: startOfLastMonth, lte: endOfLastMonth } },
            }),
            this.prisma.registration.count({
                where: {
                    registeredAt: { gte: startOfLastMonth, lte: endOfLastMonth },
                    status: { not: 'CANCELLED' },
                },
            }),
            this.prisma.payment.aggregate({
                _sum: { amount: true },
                where: {
                    status: 'COMPLETED',
                    createdAt: { gte: startOfLastMonth, lte: endOfLastMonth },
                },
            }),

            // User Growth Stats
            this.prisma.user.count({ where: { createdAt: { gte: startOfMonth } } }),
            this.prisma.user.count({ where: { createdAt: { gte: startOfLastMonth, lte: endOfLastMonth } } })
        ]);

        const totalRevenue = Number(revenueResult._sum.amount) || 0;
        const revenueThisMonth = Number(monthlyRevenueResult._sum.amount) || 0;
        const revenueLastMonth = Number(lastMonthRevenueResult._sum.amount) || 0;

        // Calculate Percentage Changes
        const calculateChange = (current: number, previous: number) => {
            if (previous === 0) return current > 0 ? 100 : 0;
            return ((current - previous) / previous) * 100;
        };

        // For active users, we don't track historical active status easily, so we'll mock it or use total growth
        // A better approach for active users would be users created this month vs last month


        return {
            totalEvents,
            activeUsers,
            totalRegistrations,
            totalRevenue,
            eventsThisMonth,
            registrationsThisMonth,
            revenueThisMonth,
            eventsChange: calculateChange(eventsThisMonth, eventsLastMonth),
            registrationsChange: calculateChange(registrationsThisMonth, registrationsLastMonth),
            revenueChange: calculateChange(revenueThisMonth, revenueLastMonth),
            activeUsersChange: calculateChange(usersThisMonth, usersLastMonth),
        };
    }

    async getRegistrationStats() {
        const total = await this.prisma.registration.count();
        const confirmed = await this.prisma.registration.count({
            where: {
                status: {
                    in: ['CONFIRMED', 'ATTENDED', 'NO_SHOW']
                }
            },
        });
        const pending = await this.prisma.registration.count({
            where: { status: 'PENDING' },
        });
        const cancelled = await this.prisma.registration.count({
            where: { status: 'CANCELLED' },
        });

        return {
            total,
            confirmed,
            pending,
            cancelled,
        };
    }
}
