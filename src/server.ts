/* eslint-disable @typescript-eslint/no-var-requires */
require('dotenv').config();
const typeDefs = require('./schema');

import logger from '@logger';
import { ApolloServer } from 'apollo-server';
import LaunchApi from '@launchApi';
import UserRepo from '@userRepo';

const server = new ApolloServer({
  typeDefs,
  dataSources: () => ({
    launchApi: new LaunchApi(),
    userRepo: new UserRepo(),
  }),
});

server.listen().then(({ url }: any) => {
  logger.info(`🚀 Server ready at ${url}`);
});
