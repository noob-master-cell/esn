import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy {
  constructor() {
    // Enhanced connection pooling configuration
    const connectionLimit = process.env.NODE_ENV === 'production' ? 20 : 10;
    const poolTimeout = 30; // seconds
    const connectionLifetime = 1800; // 30 minutes

    const dbUrl = process.env.DATABASE_URL || '';
    const params = new URLSearchParams();
    params.set('connection_limit', String(connectionLimit));
    params.set('pool_timeout', String(poolTimeout));
    params.set('connect_timeout', '10');

    const separator = dbUrl.includes('?') ? '&' : '?';
    const enhancedUrl = `${dbUrl}${separator}${params.toString()}`;

    super({
      datasources: {
        db: {
          url: enhancedUrl,
        },
      },
      log: process.env.NODE_ENV === 'production'
        ? ['warn', 'error']
        : ['query', 'info', 'warn', 'error'], // Added 'query' logging for dev
      errorFormat: 'pretty',
    });

    console.log(`📊 Database pool configured: ${connectionLimit} connections, ${poolTimeout}s timeout`);
  }

  async onModuleInit() {
    try {
      await this.$connect();
      console.log('✅ Database connected successfully');
    } catch (error) {
      console.error('❌ Database connection failed:', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
