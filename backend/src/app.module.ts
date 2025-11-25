// backend/src/app.module.ts
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriverConfig, ApolloDriver } from '@nestjs/apollo';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { ThrottlerStorageRedisService } from 'nestjs-throttler-storage-redis';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';
import { join } from 'path';

import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { EventsModule } from './events/events.module';
import { RegistrationsModule } from './registrations/registrations.module';
import { AdminModule } from './admin/admin.module';
import { CalendarModule } from './calendar/calendar.module';
import { UploadController } from './common/upload.controller';
import { HealthController } from './common/health.controller';
import { CloudinaryModule } from './cloudinary/cloudinary.module';

import { FeedbackModule } from './feedback/feedback.module';
import { GqlThrottlerGuard } from './common/guards/gql-throttler.guard';
import { CommentsModule } from './comments/comments.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // Rate Limiting: 100 requests per minute per IP (applies to REST endpoints only)
    // Rate Limiting: 100 requests per minute per IP (applies to REST endpoints only)
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 100,
        },
      ],
      storage: new ThrottlerStorageRedisService(
        process.env.REDIS_URL || 'redis://localhost:6379',
      ),
    }),
    // Caching
    CacheModule.register({
      isGlobal: true,
      store: redisStore as any,
      url: process.env.REDIS_URL || 'redis://localhost:6379',
      ttl: 60, // Default cache TTL: 60 seconds
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile:
        process.env.NODE_ENV === 'production'
          ? true
          : join(process.cwd(), 'src/schema.gql'),
      playground: false,
      plugins: [
        process.env.NODE_ENV !== 'production' ||
          process.env.ENABLE_PLAYGROUND === 'true'
          ? require('@apollo/server/plugin/landingPage/default').ApolloServerPluginLandingPageLocalDefault()
          : require('@apollo/server/plugin/landingPage/default').ApolloServerPluginLandingPageProductionDefault(),
      ],
      csrfPrevention:
        process.env.NODE_ENV === 'production' &&
        process.env.ENABLE_PLAYGROUND !== 'true',
      introspection:
        process.env.NODE_ENV !== 'production' ||
        process.env.ENABLE_PLAYGROUND === 'true',
      context: ({ req, connection, extra }) => {
        // Handle subscriptions (connection) and HTTP requests (req)
        if (connection) {
          return { req: connection.context, connection };
        }
        if (extra) {
          return { req: extra.request, extra };
        }
        return { req };
      },
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    EventsModule,
    RegistrationsModule,
    AdminModule,
    CalendarModule,
    CloudinaryModule,
    FeedbackModule,
    CommentsModule,
  ],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: GqlThrottlerGuard,
    },
  ],
  controllers: [AppController, UploadController, HealthController],
  // Note: ThrottlerGuard not applied globally to avoid GraphQL conflicts
  // Apply @UseGuards(ThrottlerGuard) on individual REST controllers if needed
})
export class AppModule { }