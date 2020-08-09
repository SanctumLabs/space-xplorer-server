/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { paginateResults } from '@utils';
import { User } from '@prisma/client';
import { Launch } from 'data/api/model';

export default {
  Query: {
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    launches: async (_, { pageSize = 20, after }, { datasources }): any => {
      const allLaunches = await datasources.launchApi.getAllLaunches();

      // reverse chronological order
      allLaunches.reverse();

      const launches = paginateResults(after, allLaunches, pageSize);

      return {
        launches,
        cursor: launches.length ? launches[launches.length - 1].cursor : null,
        hasMore: launches.length
          ? launches[launches.length - 1].cursor !== allLaunches[allLaunches.length - 1].cursor
          : false,
      };
    },
    // @ts-ignore
    launch: async (_, { id }, { datasources }): Launch =>
      await datasources.launchApi.getLaunchById(id),

    // @ts-ignore
    me: async (_, __, { datasources }): User => await datasources.userRepo.getUser(),
  },
};
