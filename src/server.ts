/* eslint-disable @typescript-eslint/no-var-requires */
require('dotenv').config();
const typeDefs = require('./schema');

import logger from '@logger';
import LaunchApi from '@launchApi';
import UserRepo from '@userRepo';
import queryResolver from '@resolvers/queryResolver';
import missionResolver from '@resolvers/missionResolver';
import userResolver from '@resolvers/userResolver';
import launchResolver from '@resolvers/launchResolver';
import mutationResolver from '@resolvers/mutationResolver';
import { ApolloServer } from 'apollo-server';

process.on('uncaughtException', (e) => {
  logger.error(`UncaughtException ${e}`);
});

const server = new ApolloServer({
  typeDefs,
  resolvers: [queryResolver, missionResolver, userResolver, launchResolver, mutationResolver],
  dataSources: () => ({
    launchApi: new LaunchApi(),
    userRepo: new UserRepo(),
  }),
});

server.listen().then(({ url }: any) => {
  logger.info(`🚀 Server ready at ${url}`);
});
