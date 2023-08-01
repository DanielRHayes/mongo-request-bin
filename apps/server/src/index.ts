import { startServer } from './server';
import { logger } from './logger';

async function main() {
  logger.info('starting server...');
  await startServer();
  logger.info('server started');
}

main();
