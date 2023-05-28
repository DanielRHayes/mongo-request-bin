import { Server } from 'socket.io';

let io: Server;

export function setSocketServer(server) {
  io = new Server(server);
  io.on('connection', () => console.log('socket connected'));
}

export { io as socketServer };
