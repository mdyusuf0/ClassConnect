import mongoose from 'mongoose';
import { env } from './env.js';
import { Logger } from '../utils/logger.js';

export const connectDatabase = async (): Promise<boolean> => {
  if (process.env.NODE_ENV === 'test') {
    return true; // Skip actual connection during unit test execution
  }
  try {
    await mongoose.connect(env.MONGO_URI, {
      serverSelectionTimeoutMS: 3000,
    });
    Logger.info('[Database] Connected to MongoDB successfully.');
    return true;
  } catch (error) {
    Logger.warn('[Database] MongoDB connection failed or offline. Operating in fallback mode:', (error as Error).message);
    return false;
  }
};
