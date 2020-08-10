import resolver from './userResolver';

describe('[User.trips]', () => {
  const mockContext = {
    dataSources: {
      userRepo: { getLaunchIdsByUser: jest.fn() },
      launchApi: { getLaunchesByIds: jest.fn() },
    },
    user: { id: 1 },
  };
  const { getLaunchIdsByUser } = mockContext.dataSources.userRepo;
  const { getLaunchesByIds } = mockContext.dataSources.launchApi;

  it('uses user id from context to lookup trips', async () => {
    getLaunchIdsByUser.mockReturnValueOnce([999]);
    getLaunchesByIds.mockReturnValueOnce([{ id: 999 }]);

    // check the resolver response
    const res = await resolver.User.trips(null, null, mockContext);
    expect(res).toEqual([{ id: 999 }]);

    // make sure the dataSources were called properly
    expect(getLaunchIdsByUser).toBeCalled();
    expect(getLaunchesByIds).toBeCalledWith({ launchIds: [999] });
  });

  it('returns empty array if no response', async () => {
    getLaunchIdsByUser.mockReturnValueOnce([]);
    getLaunchesByIds.mockReturnValueOnce([]);

    // check the resolver response
    const res = await resolver.User.trips(null, null, mockContext);
    expect(res).toEqual([]);
  });
});
