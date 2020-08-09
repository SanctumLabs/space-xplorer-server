/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { LaunchResponse } from 'data/api/model';

export default {
  User: {
    trips: async (_: any, __: any, { dataSources }: any): Promise<LaunchResponse[]> => {
      const launchIds = await dataSources.userRepo.getLaunchIdsByUser();
      if (!launchIds.length) return [];

      // look up those launches by their ids
      const launches = await dataSources.launchApi.getLaunchesByIds(launchIds);

      return launches || [];
    },
  },
};
