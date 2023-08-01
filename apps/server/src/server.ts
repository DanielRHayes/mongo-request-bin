import http from 'http';
import app from './app';
import { logger } from './logger';
import { start as startStorage } from './storage';
import { socketService } from './services/SocketService';

export async function startServer() {
  const port = process.env.PORT || '3000';
  app.set('port', port);

  // start the http server
  logger.info('creating http server...');
  const httpServer = http.createServer(app);

  // start the relevant services
  logger.info('starting services...');

  logger.info('starting socket service...');
  socketService.startService(httpServer);
  logger.info('socket service started');

  logger.info('starting storage service...');
  await startStorage();
  logger.info('storage service started');

  logger.info('starting http server...');
  httpServer.listen(port);

  httpServer.on('error', function (error: Error) {
    logger.error(`Error starting server: ${error.message}`);

    // @ts-ignore
    const errorCode = error.code as string;
    if (errorCode === 'EADDRINUSE') {
      logger.error(`Port ${port} is already in use`);
    }

    throw error;
  });

  httpServer.on('listening', function () {
    logger.info(`http server started, listening on port ${port}`);
  });
}
