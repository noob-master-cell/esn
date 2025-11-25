import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';

import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [CloudinaryModule],
  providers: [UsersService, UsersResolver],
  exports: [UsersService], // Export UsersService for use in other modules
})
export class UsersModule { }
