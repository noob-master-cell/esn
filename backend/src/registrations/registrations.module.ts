// backend/src/registrations/registrations.module.ts
import { Module } from '@nestjs/common';
import { RegistrationsService } from './registrations.service';
import { RegistrationsResolver } from './registrations.resolver';
import { PrismaModule } from '../../prisma/prisma.module';
import { ClerkModule } from '../clerk/clerk.module';

@Module({
  imports: [PrismaModule, ClerkModule],
  providers: [RegistrationsResolver, RegistrationsService],
  exports: [RegistrationsService],
})
export class RegistrationsModule {}
