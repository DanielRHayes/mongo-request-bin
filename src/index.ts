import http from 'http';
import app from './app';
import { setSocketServer } from './socketServer';
import { startStorage } from './storage';
import { PORT } from './config';

export async function start() {
  app.set('port', PORT);

  const server = http.createServer(app);
  setSocketServer(server);
  await startStorage();

  server.listen(PORT);
  server.on('listening', function () {
    console.log('Listening on port ' + PORT);
  });
}
