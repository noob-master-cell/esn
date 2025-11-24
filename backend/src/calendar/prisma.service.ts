import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    async onModuleInit() {
        // This is a best practice for connecting to the database when the module is initialized.
        await this.$connect();
    }

    // You can add a hook for onModuleDestroy to disconnect if needed,
    // but for many apps, it's not strictly necessary.
}