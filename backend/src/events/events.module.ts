import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsResolver } from './events.resolver';
import { PrismaModule } from './../../prisma/prisma.module';
import { ClerkModule } from '../clerk/clerk.module';

@Module({
  imports: [PrismaModule, ClerkModule],
  providers: [EventsResolver, EventsService],
  exports: [EventsService],
})
export class EventsModule {}
