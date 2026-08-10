import mongoose from 'mongoose';
import { env } from './env.js';

export const connectDatabase = async (): Promise<boolean> => {
  if (process.env.NODE_ENV === 'test') {
    return true; // Skip actual connection during unit test execution
  }
  try {
    await mongoose.connect(env.MONGO_URI, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log('[Database] Connected to MongoDB successfully.');
    return true;
  } catch (error) {
    console.warn('[Database] MongoDB connection failed or offline. Operating in fallback mode:', (error as Error).message);
    return false;
  }
};
