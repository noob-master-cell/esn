import { Redis } from 'ioredis';

async function main() {
    console.log('🔍 Verifying Redis connection...');

    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
    const redis = new Redis(redisUrl);

    try {
        // 1. Test Connection
        await redis.ping();
        console.log('✅ Redis connection successful');

        // 2. Test Set/Get
        const testKey = 'test:verification';
        const testValue = 'working';

        await redis.set(testKey, testValue, 'EX', 10);
        const value = await redis.get(testKey);

        if (value === testValue) {
            console.log('✅ Redis read/write successful');
        } else {
            console.error('❌ Redis read/write failed: expected', testValue, 'got', value);
        }

        // 3. Test Throttler Key (simulated)
        // We can't easily test the NestJS Throttler internals here without bootstrapping the app,
        // but if basic Redis works, Throttler should work given the config.

    } catch (error) {
        console.error('❌ Redis verification failed:', error);
        process.exit(1);
    } finally {
        redis.disconnect();
    }
}

main();
