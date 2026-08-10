import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const buildRedisUrl = (): string => {
  if (process.env.REDIS_URL) {
    return process.env.REDIS_URL;
  }
  if (process.env.REDIS_HOST) {
    const port = process.env.REDIS_PORT || '6379';
    const password = process.env.REDIS_PASSWORD ? `:${process.env.REDIS_PASSWORD}@` : '';
    return `redis://${password}${process.env.REDIS_HOST}:${port}`;
  }
  return 'redis://127.0.0.1:6379';
};

export const env = {
  PORT: process.env.PORT || '5000',
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGODB_URI: process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/classconnect',
  REDIS_URL: buildRedisUrl(),
  REDIS_HOST: process.env.REDIS_HOST,
  REDIS_PORT: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : 6379,
  REDIS_PASSWORD: process.env.REDIS_PASSWORD,
  REDIS_USERNAME: process.env.REDIS_USERNAME || 'default',

  JWT_SECRET: process.env.JWT_SECRET || 'supersecretkey_classconnect_2026',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'superrefreshsecretkey_classconnect_2026',
  
  // Bunny.net Video & Asset Storage CDN Configuration
  BUNNY_STORAGE_API_KEY: process.env.BUNNY_STORAGE_API_KEY || 'mock_bunny_api_key',
  BUNNY_STORAGE_ZONE_NAME: process.env.BUNNY_STORAGE_ZONE || process.env.BUNNY_STORAGE_ZONE_NAME || 'class-connect',
  BUNNY_CDN_URL: process.env.BUNNY_STORAGE_CDN_URL || process.env.BUNNY_STREAM_CDN_URL || process.env.BUNNY_CDN_URL || 'https://class-connect.b-cdn.net',
  BUNNY_LIBRARY_ID: process.env.BUNNY_STREAM_LIBRARY_ID || process.env.BUNNY_LIBRARY_ID || '723388',
  BUNNY_STREAM_API_KEY: process.env.BUNNY_STREAM_API_KEY || 'mock_stream_key',

  // Payment Keys
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || 'sk_test_mock',
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID || 'rzp_test_mock',
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET || 'mock_razorpay_secret',
};
