import resolver from './launchResolver';

const mockContext = {
  dataSources: {
    userRepo: { isBookedOnLaunch: jest.fn() },
  },
  user: { id: 1 },
};

const mockLaunch = {
  id: 1,
  cursor: 'after',
  site: 'Africa',
  mission: {
    name: 'foo',
    missionPatchLarge: 'LG',
    missionPatchSmall: 'SM',
  },
  rocket: {
    id: 'id',
    name: 'GroundBreaker',
    type: 'Fuse',
  },
};

describe('[Launch.isBooked]', () => {
  it('returns true if a user has already booked a trip for this launch', async () => {
    mockContext.dataSources.userRepo.isBookedOnLaunch.mockReturnValueOnce(true);

    const { isBooked } = resolver.Launch;

    const response = await isBooked(mockLaunch, null, mockContext);

    expect(response).toEqual(true);
  });

  it('returns false if a user has not booked a trip for this launch', async () => {
    mockContext.dataSources.userRepo.isBookedOnLaunch.mockReturnValueOnce(false);

    const { isBooked } = resolver.Launch;

    const response = await isBooked(mockLaunch, null, mockContext);

    expect(response).toEqual(false);
  });
});
