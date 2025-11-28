import { Module } from '@nestjs/common';
import { EventCountsLoader } from './event-counts.loader';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    providers: [EventCountsLoader],
    exports: [EventCountsLoader],
})
export class DataloaderModule { }
