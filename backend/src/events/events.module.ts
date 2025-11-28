import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsResolver } from './events.resolver';
import { PrismaModule } from '../prisma/prisma.module';

import { CloudinaryModule } from '../cloudinary/cloudinary.module';

import { DataloaderModule } from '../dataloader/dataloader.module';

/**
 * Module for managing events.
 * Imports Prisma for database access, Cloudinary for image management, and Dataloader for efficient data fetching.
 * Provides `EventsService` and `EventsResolver` for handling event logic and GraphQL operations.
 */
@Module({
  imports: [PrismaModule, CloudinaryModule, DataloaderModule],
  providers: [EventsResolver, EventsService],
  exports: [EventsService],
})
export class EventsModule { }
