import { Controller, Get, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { PrismaService } from '../prisma/prisma.service';

@Controller('health')
export class HealthController {
    constructor(
        private prisma: PrismaService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ) { }

    @Get()
    async check() {
        const health = {
            status: 'ok',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            database: 'unknown',
            redis: 'unknown',
            memory: {
                used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
                total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
            },
        };

        // Check database
        try {
            await this.prisma.$queryRaw`SELECT 1`;
            health.database = 'connected';
        } catch (error) {
            health.database = 'disconnected';
            health.status = 'degraded';
        }

        // Check Redis
        try {
            await this.cacheManager.set('health_check', 'ok', 1000);
            const value = await this.cacheManager.get('health_check');
            health.redis = value === 'ok' ? 'connected' : 'error';
        } catch (error) {
            health.redis = 'disconnected';
            health.status = 'degraded';
        }

        return health;
    }
}
