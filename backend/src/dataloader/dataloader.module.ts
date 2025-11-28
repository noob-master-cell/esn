import { Module } from '@nestjs/common';
import { EventCountsLoader } from './event-counts.loader';
import { UsersLoader } from './users.loader';
import { PrismaModule } from '../prisma/prisma.module';

/**
 * Module responsible for providing DataLoaders to the application.
 * DataLoaders are used to batch and cache database requests, preventing N+1 query issues.
 * 
 * To add a new loader:
 * 1. Create a new loader service (e.g., `UserLoader`).
 * 2. Add it to the `providers` and `exports` arrays in this module.
 * 3. Inject the loader service into your resolvers.
 */
@Module({
    imports: [PrismaModule],
    providers: [EventCountsLoader, UsersLoader],
    exports: [EventCountsLoader, UsersLoader],
})
export class DataloaderModule { }
