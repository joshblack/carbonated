/**
 * Copyright IBM Corp. 2019, 2019
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

// Inspired by: https://github.com/hunterloftis/stoppable/blob/master/lib/stoppable.js
export function graceful(server) {
  const requestsPerSocket = new Map();
  let hasStopped = false;

  server.on('connection', socket => {
    requestsPerSocket.set(socket, 0);
    socket.once('close', () => {
      requestsPerSocket.delete(socket);
    });
  });

  server.on('request', (req, res) => {
    requestsPerSocket.set(req.socket, requestsPerSocket.get(req.socket) + 1);
    res.once('finish', () => {
      const pendingRequests = requestsPerSocket.get(req.socket) - 1;
      requestsPerSocket.set(req.socket, pendingRequests);

      if (hasStopped && pendingRequests === 0) {
        req.socket.end();
      }
    });
  });

  server.shutdown = function shutdown(period = 1000) {
    hasStopped = true;

    return new Promise((resolve, reject) => {
      // Close sockets if no pending requests
      for (const [socket, pendingRequests] of requestsPerSocket) {
        if (pendingRequests === 0) {
          socket.end();
        }
      }

      server.close(error => {
        if (error) {
          reject(error);
          return;
        }

        if (requestsPerSocket.size > 0) {
          // Force all sockets to end, regardless of if they have pending
          // requests, if past the grace period. We supply `unref` here so that if
          // nothing is on the event loop we can close before this is triggered.
          setTimeout(() => closeAllSockets(resolve), period).unref();
          return;
        }

        resolve();
      });
    });
  };

  function closeAllSockets(callback) {
    for (const [socket] of requestsPerSocket) {
      socket.end();
    }
    setImmediate(() => {
      for (const [socket] of requestsPerSocket) {
        socket.destroy();
      }
      callback();
    });
  }

  return server;
}
