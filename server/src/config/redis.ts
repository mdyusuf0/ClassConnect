import Redis from 'ioredis';
import { env } from './env.js';

let redisClient: Redis | null = null;

export const connectRedis = async (): Promise<boolean> => {
  if (process.env.NODE_ENV === 'test') {
    return true;
  }
  try {
    if (env.REDIS_HOST) {
      redisClient = new Redis({
        host: env.REDIS_HOST,
        port: env.REDIS_PORT,
        password: env.REDIS_PASSWORD,
        username: env.REDIS_USERNAME,
        lazyConnect: true,
        maxRetriesPerRequest: 1,
        connectTimeout: 3000,
      });
    } else {
      redisClient = new Redis(env.REDIS_URL, {
        lazyConnect: true,
        maxRetriesPerRequest: 1,
        connectTimeout: 3000,
      });
    }

    redisClient.on('error', (err) => {
      console.warn('[Redis] Connection warning:', err.message);
    });

    await redisClient.connect();
    console.log('[Redis] Connected to Redis successfully.');
    return true;
  } catch (error) {
    console.warn('[Redis] Redis connection failed or offline. Operating in fallback mode:', (error as Error).message);
    return false;
  }
};

export const getRedisClient = (): Redis | null => {
  if (process.env.NODE_ENV === 'test') {
    return null;
  }
  if (!redisClient) {
    connectRedis().catch(() => {});
  }
  return redisClient;
};
