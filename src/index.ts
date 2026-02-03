import { env } from './env';
import { app } from './app';
import { closeDb } from './config/db';
import { closeRedis } from './config/redis';
import { logger } from './config/logger';

const server = app.listen(env.PORT, () => {
  logger.info(`Server running on port ${env.PORT}`, {
    env: env.NODE_ENV,
    port: env.PORT,
  });
});

async function shutdown(signal: string) {
  logger.info(`Received ${signal}, shutting down gracefully...`);

  try {
    server.stop();
    await closeDb();
    await closeRedis();
    logger.info('Shutdown complete');
    process.exit(0);
  } catch (err) {
    logger.error('Error during shutdown', {
      error: err instanceof Error ? err.message : String(err),
    });
    process.exit(1);
  }
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
