import { Server as HttpServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import { logger } from '../logger';

class SocketService {
  public server: SocketServer;

  constructor() {
    this.server = null;
  }

  public startService(httpServer: HttpServer): void {
    this.server = new SocketServer(httpServer);

    this.server.on('connection', (_client) => {
      logger.info('socket connected');
    });

    this.server.on('disconnect', () => {
      logger.info('socket disconnected');
    });
  }

  public emitSocketMessage(...arg: any[]) {
    if (!this.server) {
      logger.error('socketServer is undefined');
      return;
    }
    // @ts-ignore
    socketServer.emit(...arg);
  }
}

export const socketService = new SocketService();
