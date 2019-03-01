/**
 * Copyright IBM Corp. 2019, 2019
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const { logger } = require('@carbonated/server');
const { NODE_ENV } = require('config');
const { Pool } = require('pg');
const { createBackoff } = require('../tools/delay');
const safe = require('../tools/safe');

async function createPostgresClient(connectionString) {
  const pool = new Pool({
    connectionString,
    connectionTimeoutMillis: NODE_ENV === 'production' ? 1000 * 30 : 5000,
  });
  const client = await pool.connect();

  return {
    client,
    close() {
      return client.end();
    },
  };
}

async function createPostgresClientWithRetries(
  connectionString,
  numRetries = 5
) {
  const backoff = createBackoff();
  let client;
  let error;

  for (let i = 0; i < numRetries; i++) {
    if (i !== 0) {
      await backoff();
      logger.info(`retrying pg connection, attempt #${i}`);
    }

    [error, client] = await safe(createPostgresClient(connectionString));
    if (!error) {
      return client;
    }
  }

  throw error;
}

module.exports = {
  createPostgresClient: createPostgresClientWithRetries,
};
