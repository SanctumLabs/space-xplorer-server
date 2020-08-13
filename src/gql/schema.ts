/* eslint-disable @typescript-eslint/no-var-requires */
import { gql } from 'apollo-server';
import querySchema from './query/schema';
import mutationSchema from './mutation/schema';
import launchSchema from './launch/schema';
import userSchema from './user/schema';

export default gql`
  ${querySchema}

  ${mutationSchema}

  ${launchSchema}

  ${userSchema}
`;
