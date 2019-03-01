/**
 * Copyright IBM Corp. 2019, 2019
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @jest-environment node
 */

'use strict';

describe('server', () => {
  let config;
  let main;

  beforeEach(() => {
    config = require('config');
    main = require('../');
  });

  it.todo('should exit early if storage clients fail to connect');

  it.todo('should exit early if server setup fails');

  it.todo('should exit early if the server fails to bind to a host:port');

  it.todo('should return a cleanup handler');

  it('should work', () => {
    //
  });
});
