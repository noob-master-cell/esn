import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { Auth0Guard } from './guards/auth0.guard';

@Module({
  imports: [PassportModule, ConfigModule],
  controllers: [],
  providers: [AuthService, AuthResolver, Auth0Guard],
  exports: [AuthService, Auth0Guard],
})
export class AuthModule { }