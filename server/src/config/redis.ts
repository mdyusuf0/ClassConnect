import Redis from 'ioredis';
import { env } from './env.js';
import { Logger } from '../utils/logger.js';

let redisClient: Redis | null = null;

export const connectRedis = async (): Promise<boolean> => {
  if (process.env.NODE_ENV === 'test') {
    return true;
  }
  try {
    redisClient = new Redis({
      host: env.REDIS_HOST,
      port: env.REDIS_PORT,
      username: env.REDIS_USERNAME,
      password: env.REDIS_PASSWORD,
      lazyConnect: true,
      maxRetriesPerRequest: 1,
      connectTimeout: 3000,
      retryStrategy: () => null,
    });

    redisClient.on('error', (err) => {
      // Handled silently in fallback
    });

    await redisClient.connect();
    Logger.info('[Redis] Connected to Redis successfully.');
    return true;
  } catch (error) {
    Logger.warn('[Redis] Redis connection failed or offline. Operating in fallback mode:', (error as Error).message);
    if (redisClient) {
      try { redisClient.disconnect(); } catch (e) {}
      redisClient = null;
    }
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
