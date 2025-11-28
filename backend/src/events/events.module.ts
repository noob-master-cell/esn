import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsResolver } from './events.resolver';
import { PrismaModule } from '../prisma/prisma.module';

import { CloudinaryModule } from '../cloudinary/cloudinary.module';

import { DataloaderModule } from '../dataloader/dataloader.module';

@Module({
  imports: [PrismaModule, CloudinaryModule, DataloaderModule],
  providers: [EventsResolver, EventsService],
  exports: [EventsService],
})
export class EventsModule { }
