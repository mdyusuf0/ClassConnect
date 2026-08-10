import { createApp } from './app.js';
import { env } from './config/env.js';
import { connectDatabase } from './config/database.js';

const startServer = async () => {
  await connectDatabase();
  const app = createApp();

  const PORT = parseInt(env.PORT, 10);
  app.listen(PORT, () => {
    console.log(`[ClassConnect API] Server running on http://localhost:${PORT}`);
  });
};

startServer();
