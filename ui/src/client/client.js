import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

export const client = new ApolloClient({
  link: createHttpLink({
    credentials: 'include',
    uri: '/graphql',
  }),
  cache: new InMemoryCache(),
});
