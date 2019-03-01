/**
 * Copyright IBM Corp. 2019, 2019
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

function sleep(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

function createBackoff() {
  let numRetries = 0;
  let sleepAmount = 1000;

  return async () => {
    if (numRetries === 0) {
      numRetries = 1;
      return;
    }
    await sleep(sleepAmount);
    sleepAmount = sleepAmount * 2;
    numRetries++;
  };
}

module.exports = {
  createBackoff,
  sleep,
};
