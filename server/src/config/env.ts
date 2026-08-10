import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export const env = {
  PORT: process.env.PORT || '5000',
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/classconnect',
  REDIS_URL: process.env.REDIS_URL || 'redis://127.0.0.1:6379',
  JWT_SECRET: process.env.JWT_SECRET || 'supersecretkey_classconnect_2026',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'superrefreshsecretkey_classconnect_2026',
  
  // Bunny.net Video & Asset Storage CDN Configuration
  BUNNY_STORAGE_API_KEY: process.env.BUNNY_STORAGE_API_KEY || 'mock_bunny_api_key',
  BUNNY_STORAGE_ZONE_NAME: process.env.BUNNY_STORAGE_ZONE_NAME || 'classconnect-storage',
  BUNNY_CDN_URL: process.env.BUNNY_CDN_URL || 'https://classconnect.b-cdn.net',
  BUNNY_LIBRARY_ID: process.env.BUNNY_LIBRARY_ID || '123456',
  BUNNY_STREAM_API_KEY: process.env.BUNNY_STREAM_API_KEY || 'mock_stream_key',
};
