/**
 * Copyright IBM Corp. 2019, 2019
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const safeAsyncHandler = require('../tools/safeAsyncHandler');

module.exports = (server, context) => {
  const { storage } = context;
  const checks = [
    {
      ping() {
        return new Promise((resolve, reject) => {
          storage.redis.client.ping((error, response) => {
            if (error) {
              reject(error);
              return;
            }
            resolve();
          });
        });
      },
    },
    {
      ping() {
        return storage.postgres.client.query(
          'SELECT * from information_schema.tables'
        );
      },
    },
  ];

  server.get(
    '/health-check',
    safeAsyncHandler(async (req, res) => {
      for (const check of checks) {
        await check.ping();
      }

      res.send('OK');
    })
  );
  return server;
};
