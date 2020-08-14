import UserRepo from './UserRepository';
import {
  mockUser,
  mockCreateUser,
  mockFindOneUser,
  mockCreateTrip,
  mockTrip,
  mockTrip2,
  mockDeleteTrip,
  mockFindManyTrips,
  mockFindOneTrip,
} from './mocks';

jest.mock('./db', () => ({
  get user() {
    return {
      create: mockCreateUser,
      findOne: mockFindOneUser,
    };
  },
  get trip() {
    return {
      create: mockCreateTrip,
      delete: mockDeleteTrip,
      findMany: mockFindManyTrips,
      findOne: mockFindOneTrip,
    };
  },
}));

const ds = new UserRepo();
ds.initialize({
  context: { user: { id: mockUser.id, identifier: mockUser.identifier, email: mockUser.email } },
});

describe('[UserRepo.creatUser]', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns null for invalid emails', async () => {
    const res = await ds.createUser('boo!');
    expect(res).toBeFalsy();
  });

  it('successfully creates a user with a valid email address', async () => {
    // check the result of the fn
    const res = await ds.createUser(mockUser.email);
    expect(res).toEqual(mockUser);

    expect(mockCreateUser).toBeCalledTimes(1);
  });

  it('returns null if there was an error creating a user', async () => {
    const res = await ds.createUser('johndoe@space.xplorer');
    expect(res).toEqual(null);
  });
});

describe('[UserRepo.getUser]', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns null for invalid emails', async () => {
    const res = await ds.getUser('boo!');
    expect(res).toBeFalsy();
  });

  it('returns a user with valid email for a user in the data store', async () => {
    // check the result of the fn
    const res = await ds.getUser(mockUser.email);
    expect(res).toEqual(mockUser);

    // make sure store is called properly
    expect(mockFindOneUser).toBeCalledWith({
      where: { email: mockUser.email },
    });
  });

  it('returns null if no user found with a given email address', async () => {
    // store lookup is not mocked to return anything, so this
    // simulates a failed lookup
    const res = await ds.getUser('johndoe@space.xplorer');
    expect(res).toEqual(null);
  });
});

describe('[UserRepo.bookTrip]', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates a trip for a user & returns the trip', async () => {
    const res = await ds.bookTrip(mockTrip.launchId);
    expect(res).toEqual(mockTrip);

    // make sure store is called properly
    expect(mockCreateTrip).toBeCalledTimes(1);
  });

  it('returns null if there is a failure to create a trip for a user', async () => {
    const res = await ds.bookTrip(90);
    expect(res).toBeNull();
  });
});

describe('[UserRepo.bookTrips]', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns multiple lookups from bookTrip', async () => {
    const res = await ds.bookTrips([mockTrip.launchId, mockTrip2.launchId]);
    expect(res).toEqual([mockTrip, mockTrip2]);

    // make sure store is called properly
    expect(mockCreateTrip).toBeCalledTimes(2);
  });
});

describe('[UserRepo.cancelTrip]', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deletes the trip for the user', async () => {
    const args = {
      include: { user: { select: { id: true } } },
      where: { launchId: mockTrip.launchId },
    };

    const res = await ds.cancelTrip(mockTrip.launchId);
    expect(res).toEqual(mockTrip);

    // make sure store is called properly
    expect(mockDeleteTrip).toBeCalledTimes(1);
    expect(mockDeleteTrip).toBeCalledWith(args);
  });

  it('returns null if there is an attempt to delete a trip and the data store returns an error', async () => {
    const args = {
      include: { user: { select: { id: true } } },
      where: { launchId: 90 },
    };

    const res = await ds.cancelTrip(90);
    expect(res).toBeNull();

    // make sure store is called properly
    expect(mockDeleteTrip).toBeCalledTimes(1);
    expect(mockDeleteTrip).toBeCalledWith(args);
  });
});

describe('[UserRepo.getLaunchIdsByUser]', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('looks up launches by user', async () => {
    const args = {
      where: {
        user: {
          identifier: mockUser.identifier,
        },
      },
    };

    const res = await ds.getLaunchIdsByUser();
    expect(res).toEqual([mockTrip.launchId, mockTrip2.launchId]);

    // make sure store is called properly
    expect(mockFindManyTrips).toBeCalledWith(args);
  });

  it('returns empty array if nothing found', async () => {
    const args = {
      where: {
        user: {
          identifier: 'unknown-identifier',
        },
      },
    };

    const userRepo = new UserRepo();
    userRepo.initialize({
      context: {
        user: { id: mockUser.id, identifier: 'unknown-identifier', email: mockUser.email },
      },
    });

    // check the result of the fn
    const res = await userRepo.getLaunchIdsByUser();
    expect(res).toEqual([]);

    // make sure store is called properly
    expect(mockFindManyTrips).toBeCalledWith(args);
  });

  it('returns empty array if an exception is caught', async () => {
    const args = {
      where: {
        user: {
          identifier: 'unknown',
        },
      },
    };

    const userRepo = new UserRepo();
    userRepo.initialize({
      context: {
        user: { id: mockUser.id, identifier: 'unknown', email: mockUser.email },
      },
    });

    // check the result of the fn
    const res = await userRepo.getLaunchIdsByUser();
    expect(res).toEqual([]);

    // make sure store is called properly
    expect(mockFindManyTrips).toBeCalledWith(args);
  });
});

describe('[UserRepo.isBookedOnLaunch]', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('looks up if a user has already booked a trip for a given launch', async () => {
    const args = {
      where: {
        launchId: mockTrip.launchId,
      },
      include: {
        user: {
          select: {
            identifier: mockUser.identifier,
          },
        },
      },
    };

    const res = await ds.isBookedOnLaunch(mockTrip.launchId);
    expect(res).toEqual(true);

    // make sure store is called properly
    expect(mockFindOneTrip).toBeCalledWith(args);
  });

  it('returns false if nothing is found', async () => {
    const args = {
      where: {
        launchId: 90,
      },
      include: {
        user: {
          select: {
            identifier: mockUser.identifier,
          },
        },
      },
    };

    // check the result of the fn
    const res = await ds.isBookedOnLaunch(90);
    expect(res).toEqual(false);

    // make sure store is called properly
    expect(mockFindOneTrip).toBeCalledWith(args);
  });
});
