import { createApp } from './app.js';
import { env } from './config/env.js';
import { connectDatabase } from './config/database.js';
import { connectRedis } from './config/redis.js';
import { Logger } from './utils/logger.js';

const startServer = async () => {
  // Use Promise.all to initialize database (MongoDB) and Redis connection instances simultaneously
  await Promise.all([connectDatabase(), connectRedis()]);

  const app = createApp();
  const PORT = parseInt(env.PORT, 10);
  app.listen(PORT, () => {
    Logger.info(`[ClassConnect API] Server running on http://localhost:${PORT}`);
  });
};

startServer();
