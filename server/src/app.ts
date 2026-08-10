import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { requestLogger } from './middleware/logger.js';
import { errorHandler } from './middleware/errorHandler.js';
import { apiRateLimiter } from './middleware/rateLimiter.js';
import routes from './routes/index.js';

export const createApp = (): Express => {
  const app = express();

  // Security and Middleware
  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(requestLogger);
  app.use('/api', apiRateLimiter);

  // Routes
  app.use('/api', routes);

  // 404 handler
  app.use((_req, res) => {
    res.status(404).json({ success: false, error: 'Endpoint not found' });
  });

  // Centralized Error Handling
  app.use(errorHandler);

  return app;
};
