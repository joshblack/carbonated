/**
 * Copyright IBM Corp. 2019, 2019
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const { logger } = require('@carbonated/server');
const { createPostgresClient } = require('./postgres');
const { createRedisClient } = require('./redis');

/**
 * @typedef PostgresConfig
 * @property {string} POSTGRES_CONN_STR
 */

/**
 * @typedef RedisConfig
 * @property {string} REDIS_CONN_STR
 * @property {string} REDIS_CERT_BASE64
 */

/**
 * Create the clients necessary for interacting with our Postgres and Redis
 * stores.
 * @param {Object} config
 * @param {PostgresConfig} config.postgres
 * @param {RedisConfig} config.redis
 */
async function create({ postgres, redis }) {
  const { POSTGRES_CONN_STR } = postgres;
  const { REDIS_CONN_STR, REDIS_CERT_BASE64 } = redis;

  const clients = await Promise.all([
    createPostgresClient(POSTGRES_CONN_STR),
    createRedisClient(REDIS_CONN_STR, REDIS_CERT_BASE64),
  ]);

  return {
    postgres: clients[0],
    redis: clients[1],
  };
}

/**
 * Given a storage object, go through each of the clients and call `close` on
 * them.
 * @param {Object} storage
 */
function close(storage) {
  for (const key of Object.keys(storage)) {
    try {
      storage[key].close();
    } catch (error) {
      logger.error(error);
    }
  }
}

module.exports = {
  create,
  close,
};
