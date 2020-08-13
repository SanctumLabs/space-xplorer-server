/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-explicit-any */

import isEmail from 'isemail';
import UserRepo from '@userRepo';

const userRepo = new UserRepo();

// the function that sets up the global context for each resolver, using the req
export default async ({ req }: any) => {
  // simple auth check on every request
  const auth = (req.headers && req.headers.authorization) || '';
  const email = Buffer.from(auth, 'base64').toString('ascii');

  // if the email isn't formatted validly, return null for user
  if (!isEmail.validate(email)) return { user: null };

  // find a user by their email
  const user = await userRepo.getUser(email);
  return { user };
};
