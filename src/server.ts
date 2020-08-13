// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

import { ApolloServer } from 'apollo-server';

import logger from '@logger';
import LaunchApi from '@launchApi';
import UserRepo from '@userRepo';
import queryResolver from '@queryResolver';
import missionResolver from '@missionResolver';
import userResolver from '@userResolver';
import launchResolver from '@launchResolver';
import mutationResolver from '@mutationResolver';
import typeDefs from '@gql/schema';
import { environment, port, cacheConfig } from '@config';
import cache from '@cache';
import context from '@context';

process.on('uncaughtException', (e) => {
  logger.error(`UncaughtException ${e}`);
});

// set up any dataSources our resolvers need
const dataSources = () => ({
  launchApi: new LaunchApi(),
  userRepo: new UserRepo(),
});

const server = new ApolloServer({
  typeDefs,
  resolvers: [queryResolver, missionResolver, userResolver, launchResolver, mutationResolver],
  dataSources,
  context,
  logger,
  // only configure cache if available
  cache: cacheConfig.isAvailable ? cache : undefined,
  debug: environment !== 'production',
  playground: environment !== 'production',
  introspection: environment !== 'production',
  engine: {
    reportSchema: true,
    logger,
  },
});

server
  .listen({
    port,
  })
  .then(({ url }) => {
    logger.info(`🚀 Server ready at ${url}`);
  });
