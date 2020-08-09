/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { LaunchResponse } from 'data/api/model';

export default {
  Launch: {
    isBooked: async (launch: LaunchResponse, _: any, { dataSources }: any): Promise<boolean> =>
      await dataSources.userRepo.isBookedOnLaunch({ launchId: launch.id }),
  },
};
