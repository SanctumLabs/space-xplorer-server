/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
export default {
  Mutation: {
    bookTrips: async (_: any, { launchIds }: any, { dataSources }: any): Promise<any> => {
      const results = await dataSources.userRepo.bookTrips(
        launchIds.map((launchId: any) => parseInt(launchId)),
      );

      const launches = await dataSources.launchApi.getLaunchesByIds(launchIds);

      return {
        success: results && results.length === launchIds.length,
        message:
          results.length === launchIds.length
            ? 'Trips booked successfully'
            : `The following launches could not be booked: ${launchIds.filter(
                (id: any) => !results.includes(id),
              )}`,
        launches,
      };
    },

    cancelTrip: async (_: any, { launchId }: any, { dataSources }: any) => {
      const result = dataSources.userRepo.cancelTrip(parseInt(launchId));

      if (!result)
        return {
          success: false,
          message: 'Failed to cancel trip',
        };

      const launch = await dataSources.launchApi.getLaunchById(launchId);
      return {
        success: true,
        message: 'Trip cancelled',
        launches: [launch],
      };
    },

    signUp: async (_: any, { email }: any, { dataSources }: any) => {
      const user = await dataSources.userRepo.createUser(email);
      if (user) {
        return user;
      }
    },

    login: async (_: any, { email }: any, { dataSources }: any) => {
      const user = await dataSources.userRepo.getUser(email);
      if (user) {
        user.token = Buffer.from(email).toString('base64');
        return user;
      }
    },

    uploadProfileImage: async (_: any, { file }: any, { dataSources }: any) =>
      await dataSources.userRepo.uploadProfileImage(file),
  },
};
