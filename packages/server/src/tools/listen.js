import { HOST, PROTOCOL, PORT } from 'config';
import { logger } from './logger';
import { setupHTTPSServer } from './setupHTTPSServer';
import { graceful } from './graceful';

export function listen(server) {
  const service =
    PROTOCOL === 'https' && HOST === 'localhost'
      ? setupHTTPSServer(server)
      : server;

  return new Promise((resolve, reject) => {
    const handler = service.listen(PORT, HOST, error => {
      if (error) {
        return reject(error);
      }

      if (PROTOCOL !== 'http') {
        resolve(graceful(handler));
      } else {
        resolve(handler);
      }
    });
  });
}
