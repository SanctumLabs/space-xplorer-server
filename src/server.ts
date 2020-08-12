/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-explicit-any */
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
import isEmail from 'isemail';
import { environment } from '@config';

process.on('uncaughtException', (e) => {
  logger.error(`UncaughtException ${e}`);
});

const userRepo = new UserRepo();

// set up any dataSources our resolvers need
const dataSources = () => ({
  launchApi: new LaunchApi(),
  userRepo: userRepo,
});

// the function that sets up the global context for each resolver, using the req
const context = async ({ req }: any) => {
  // simple auth check on every request
  const auth = (req.headers && req.headers.authorization) || '';
  const email = new Buffer(auth, 'base64').toString('ascii');

  // if the email isn't formatted validly, return null for user
  if (!isEmail.validate(email)) return { user: null };

  // find a user by their email
  const user = await userRepo.getUser(email);
  return { user };
};

const server = new ApolloServer({
  typeDefs,
  resolvers: [queryResolver, missionResolver, userResolver, launchResolver, mutationResolver],
  dataSources,
  context,
  logger,
  debug: environment !== 'production',
  playground: environment !== 'production',
  introspection: environment !== 'production',
  engine: {
    reportSchema: true,
    logger,
  },
});

server.listen().then(({ url }: any) => {
  logger.info(`🚀 Server ready at ${url}`);
});
