// backend/src/app.module.ts
import { Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
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
import { PubSubModule } from './common/pubsub.module';
import { DataloaderModule } from './dataloader/dataloader.module';

import { FeedbackModule } from './feedback/feedback.module';
import { GqlThrottlerGuard } from './common/guards/gql-throttler.guard';
import { PerformanceInterceptor } from './common/interceptors/performance.interceptor';
import { CommentsModule } from './comments/comments.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // Tiered Rate Limiting for better traffic control
    // Short: Prevents rapid bursts (10 req/sec)
    // Medium: Sustained traffic (100 req/min)
    // Long: Hourly limit (1000 req/hour)
    ThrottlerModule.forRoot({
      throttlers: [
        {
          name: 'short',
          ttl: 1000,      // 1 second
          limit: 10,      // 10 requests per second (burst protection)
        },
        {
          name: 'medium',
          ttl: 60000,     // 1 minute
          limit: 100,     // 100 requests per minute (sustained)
        },
        {
          name: 'long',
          ttl: 3600000,   // 1 hour
          limit: 1000,    // 1000 requests per hour (hourly cap)
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
        // Query complexity plugin to prevent expensive queries
        {
          async requestDidStart() {
            const { directiveEstimator, simpleEstimator, getComplexity } = await import('graphql-query-complexity');
            return {
              async didResolveOperation({ request, document, schema }) {
                const complexity = getComplexity({
                  schema,
                  query: document,
                  variables: request.variables,
                  estimators: [
                    directiveEstimator(),
                    simpleEstimator({ defaultComplexity: 1 }),
                  ],
                });

                const maxComplexity = 1000; // Adjust based on your needs
                if (complexity > maxComplexity) {
                  throw new Error(
                    `Query is too complex: ${complexity}. Maximum allowed complexity: ${maxComplexity}`,
                  );
                }
                // Log complexity in development
                if (process.env.NODE_ENV !== 'production') {
                  console.log(`GraphQL Query complexity: ${complexity}`);
                }
              },
            };
          },
        },
      ],
      csrfPrevention:
        process.env.NODE_ENV === 'production' &&
        process.env.ENABLE_PLAYGROUND !== 'true',
      introspection:
        process.env.NODE_ENV !== 'production' ||
        process.env.ENABLE_PLAYGROUND === 'true',
      subscriptions: {
        'graphql-ws': true,
      },
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
    PubSubModule,
    DataloaderModule,
  ],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: GqlThrottlerGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: PerformanceInterceptor,
    },
  ],
  controllers: [AppController, UploadController, HealthController],
  // Note: ThrottlerGuard not applied globally to avoid GraphQL conflicts
  // Apply @UseGuards(ThrottlerGuard) on individual REST controllers if needed
})
export class AppModule { }