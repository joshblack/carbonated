/**
 * Copyright IBM Corp. 2019, 2019
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const {
  GH_TOKEN,
  HOST,
  PORT,
  PROTOCOL,
  POSTGRES_CONN_STR,
  REDIS_CONN_STR,
  REDIS_CERT_BASE64,
} = require('config');
const { logger, listen } = require('@carbonated/server');
const setupServer = require('./server');
const Storage = require('./storage');
const Repo = require('./repo');

async function main() {
  const storage = await Storage.create({
    postgres: {
      POSTGRES_CONN_STR,
    },
    redis: {
      REDIS_CONN_STR,
      REDIS_CERT_BASE64,
    },
  });
  const repo = Repo.create({
    postgres: storage.postgres,
    github: {
      GH_TOKEN,
    },
  });
  const server = await setupServer({
    repo,
    storage,
  });
  const handler = await listen(server);

  logger.info(`Server listening at ${PROTOCOL}://${HOST}:${PORT}`);

  return async () => {
    logger.info('gracefully shutting down service');

    await handler.shutdown();
    Storage.close(storage);
  };
}

/**
 * Run the given function once, even if called multiple times
 * @param {Function} fn
 * @return {Function}
 */
function once(fn) {
  let hasBeenCalled = false;
  return (...args) => {
    if (hasBeenCalled) {
      return;
    }
    hasBeenCalled = true;
    return fn(...args);
  };
}

// If run by the Node.js process, run the script directly. Otherwise, export so
// that we can consume it in a test as a module
if (require.main === module) {
  main()
    .then(handleCleanup => {
      // Wrap handler so that it's only called once. Useful if multiple signals
      // are sent for shutting down the process as we only want to run shutdown
      // on the first signal recieved.
      const cleanup = once(handleCleanup);
      const shutdown = async () => {
        let exitCode = 0;
        try {
          await cleanup();
        } catch (error) {
          console.error(error);
          exitCode = 1;
        } finally {
          process.exit(exitCode);
        }
      };

      // App is closing
      process.on('exit', shutdown);
      process.on('SIGTERM', shutdown);

      // Catch CTRL+C
      process.on('SIGINT', shutdown);

      // Catch "kill pid"
      process.on('SIGUSR1', shutdown);
      process.on('SIGUSR2', shutdown);

      // Catch uncaught exceptions
      process.on('uncaughtException', error => {
        console.error(error);
        cleanup();
        process.exit(1);
      });
    })
    .catch(error => {
      console.error(error);
      process.exitCode = 1;
    });
} else {
  module.exports = main;
}
