import { Module, Global } from '@nestjs/common';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { ConfigService } from '@nestjs/config';

export const PUB_SUB = 'PUB_SUB';

@Global()
@Module({
    providers: [
        {
            provide: PUB_SUB,
            useFactory: (configService: ConfigService) => {
                return new RedisPubSub({
                    connection: configService.get('REDIS_URL') || 'redis://localhost:6379',
                });
            },
            inject: [ConfigService],
        },
    ],
    exports: [PUB_SUB],
})
export class PubSubModule { }
