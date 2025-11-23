import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';

@Module({
  providers: [UsersService, UsersResolver],
  exports: [UsersService], // Export UsersService for use in other modules
})
export class UsersModule {}
