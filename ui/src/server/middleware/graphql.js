'use strict';

const { DEPLOY_ENV } = require('config');
const graphqlHTTP = require('express-graphql');
const { schema } = require('../graphql');

module.exports = (server, context) => {
  server.use('/graphql', (req, res, next) => {
    return graphqlHTTP({
      schema,
      graphiql: DEPLOY_ENV === 'local',
      context: {
        ...context.repo,
        session: req.session,
      },
    })(req, res, next);
  });
  return server;
};
