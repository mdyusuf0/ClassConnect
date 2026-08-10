import Redis from 'ioredis';
import { env } from './env.js';

let redisClient: Redis | null = null;

export const getRedisClient = (): Redis | null => {
  if (process.env.NODE_ENV === 'test') {
    return null;
  }
  if (!redisClient) {
    try {
      redisClient = new Redis(env.REDIS_URL, {
        lazyConnect: true,
        maxRetriesPerRequest: 1,
        connectTimeout: 2000,
      });

      redisClient.on('error', (err) => {
        console.warn('[Redis] Connection warning:', err.message);
      });
    } catch (err) {
      console.warn('[Redis] Failed to initialize Redis client');
      redisClient = null;
    }
  }
  return redisClient;
};
