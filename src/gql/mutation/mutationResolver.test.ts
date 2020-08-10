import resolver from './mutationResolver';

const mockContext = {
  dataSources: {
    userRepo: {
      bookTrips: jest.fn(),
      cancelTrip: jest.fn(),
      getUser: jest.fn(),
      createUser: jest.fn(),
    },
    launchApi: {
      getLaunchesByIds: jest.fn(),
      getLaunchById: jest.fn(),
    },
  },
  user: { id: 1, email: 'a@a.a' },
};

describe('[Mutation.bookTrips]', () => {
  const { bookTrips } = mockContext.dataSources.userRepo;
  const { getLaunchesByIds } = mockContext.dataSources.launchApi;

  it('returns true if booking succeeds', async () => {
    bookTrips.mockReturnValueOnce([{ launchId: 999 }]);
    getLaunchesByIds.mockReturnValueOnce([{ id: 999, cursor: 'foo' }]);

    // check the resolver response
    const res = await resolver.Mutation.bookTrips(null, { launchIds: [123] }, mockContext);
    expect(res).toEqual({
      launches: [{ cursor: 'foo', id: 999 }],
      message: 'Trips booked successfully',
      success: true,
    });

    // check if the dataSource was called with correct args
    expect(bookTrips).toBeCalledWith([123]);
  });

  it('returns false if booking fails', async () => {
    bookTrips.mockReturnValueOnce([]);

    // check the resolver response
    const res = await resolver.Mutation.bookTrips(null, { launchIds: [123] }, mockContext);

    expect(res.message).toBeDefined();
    expect(res.success).toBeFalsy();
  });
});

describe('[Mutation.cancelTrip]', () => {
  const { cancelTrip } = mockContext.dataSources.userRepo;
  const { getLaunchById } = mockContext.dataSources.launchApi;

  it('returns true if cancelling succeeds', async () => {
    cancelTrip.mockReturnValueOnce(true);
    getLaunchById.mockReturnValueOnce({ id: 999, cursor: 'foo' });

    // check the resolver response
    const res = await resolver.Mutation.cancelTrip(null, { launchId: 123 }, mockContext);
    expect(res).toEqual({
      success: true,
      message: 'Trip cancelled',
      launches: [{ id: 999, cursor: 'foo' }],
    });

    // check if the dataSource was called with correct args
    expect(cancelTrip).toBeCalledWith(123);
  });

  it('returns false if cancelling fails', async () => {
    cancelTrip.mockReturnValueOnce(false);

    // check the resolver response
    const res = await resolver.Mutation.cancelTrip(null, { launchId: 123 }, mockContext);
    expect(res.message).toBeDefined();
    expect(res.success).toBeFalsy();
  });
});

describe('[Mutation.login]', () => {
  const { getUser } = mockContext.dataSources.userRepo;

  it('returns base64 encoded email as user token if successful', async () => {
    const args = { email: 'a@a.a' };
    const base64Email = new Buffer(mockContext.user.email).toString('base64');
    getUser.mockReturnValueOnce({ token: base64Email });

    // check the resolver response
    const res = await resolver.Mutation.login(null, args, mockContext);
    expect(res.token).toEqual('YUBhLmE=');

    // check if the dataSource was called with correct args
    expect(getUser).toBeCalledWith(args.email);
  });

  it('returns nothing if login fails', async () => {
    const args = { email: 'a@a.a' };
    // simulate failed lookup/creation
    getUser.mockReturnValueOnce(false);

    // check the resolver response
    const res = await resolver.Mutation.login(null, args, mockContext);
    expect(res).toBeFalsy();
  });
});
