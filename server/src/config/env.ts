import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export const env = {
  PORT: process.env.PORT || '5000',
  NODE_ENV: process.env.NODE_ENV || 'development',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  MONGO_URI: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/classconnect',
  
  REDIS_HOST: process.env.REDIS_HOST || '127.0.0.1',
  REDIS_PORT: parseInt(process.env.REDIS_PORT || '6379', 10),
  REDIS_USERNAME: process.env.REDIS_USERNAME || 'default',
  REDIS_PASSWORD: process.env.REDIS_PASSWORD || '',

  JWT_SECRET: process.env.JWT_SECRET || 'classconnect_super_secret_jwt_key_2026',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET || 'classconnect_super_secret_refresh_key_2026',

  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || '',
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || '',
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || '',

  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID || 'rzp_test_mockkey123',
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET || 'mock_razorpay_secret_key_2026',
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || 'sk_test_mock_stripe_secret_key_2026',

  SMTP_HOST: process.env.SMTP_HOST || 'smtp.gmail.com',
  SMTP_PORT: parseInt(process.env.SMTP_PORT || '587', 10),
  SMTP_USER: process.env.SMTP_USER || '',
  SMTP_PASS: process.env.SMTP_PASS || '',

  BUNNY_STREAM_LIBRARY_ID: process.env.BUNNY_STREAM_LIBRARY_ID || '723388',
  BUNNY_STREAM_API_KEY: process.env.BUNNY_STREAM_API_KEY || 'mock_key',
  BUNNY_STREAM_CDN_URL: process.env.BUNNY_STREAM_CDN_URL || 'https://vz-e90d4726-817.b-cdn.net',
  BUNNY_STORAGE_ZONE: process.env.BUNNY_STORAGE_ZONE || 'class-connect',
  BUNNY_STORAGE_API_KEY: process.env.BUNNY_STORAGE_API_KEY || 'mock_storage_key',
  BUNNY_STORAGE_CDN_URL: process.env.BUNNY_STORAGE_CDN_URL || 'https://class-connect.b-cdn.net',
};
