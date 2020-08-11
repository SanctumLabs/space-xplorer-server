/* eslint-disable @typescript-eslint/no-explicit-any */
import IsEmail from 'isemail';

export const mockUser = {
  id: 1,
  identifier: 'identifier',
  createdAt: Date.now(),
  updatedAt: Date.now(),
  email: 'a@a.com',
  profileImage: '',
  token: 'token',
};

export const mockTrip = {
  id: 1,
  identifier: 'trip-identifier',
  createdAt: Date.now(),
  updatedAt: Date.now(),
  launchId: 12,
  userId: mockUser.id,
};

export const mockTrip2 = {
  id: 2,
  identifier: 'trip2-identifier',
  createdAt: Date.now(),
  updatedAt: Date.now(),
  launchId: 13,
  userId: mockUser.id,
};

export const mockCreateUser = jest.fn(
  async ({ data: { email } }): Promise<any> => {
    if (IsEmail.validate(email)) {
      switch (email) {
        case mockUser.email: {
          return mockUser;
        }

        case 'johndoe@space.xplorer': {
          throw new Error('Failed to create user');
        }
      }
      return mockUser;
    } else {
      return null;
    }
  },
);

export const mockFindOneUser = jest.fn(
  async ({ where: { email } }): Promise<any> => {
    if (IsEmail.validate(email)) {
      switch (email) {
        case mockUser.email: {
          return mockUser;
        }
        // simulate a non-existent user
        case 'johndoe@space.xplorer': {
          return null;
        }
      }
    } else {
      return null;
    }
  },
);

export const mockCreateTrip = jest.fn(
  async ({ data: { launchId } }): Promise<any> => {
    switch (launchId) {
      case mockTrip.launchId: {
        return mockTrip;
      }
      case mockTrip2.launchId: {
        return mockTrip2;
      }
      case 90: {
        // simulates a failure to book trip;
        throw new Error('FAILURE TO LAUNCH');
      }
      default:
        return null;
    }
  },
);

export const mockDeleteTrip = jest.fn(
  async ({ where: { launchId } }): Promise<any> => {
    switch (launchId) {
      case mockTrip.launchId: {
        return mockTrip;
      }
      case mockTrip2.launchId: {
        return mockTrip2;
      }
      case 90: {
        // simulates a failure to delete a trip
        throw new Error('FAILURE TO DELETE TRIP');
      }
      default:
        return null;
    }
  },
);

export const mockFindManyTrips = jest.fn(
  async ({
    where: {
      user: { identifier },
    },
  }): Promise<any> => {
    switch (identifier) {
      case mockUser.identifier: {
        return [mockTrip, mockTrip2];
      }
      case 'unknown-identifier': {
        return [];
      }
      case 'unknown': {
        // simulates a failure to get a user's trips
        throw new Error('FAILURE TO GET USER TRIPS');
      }
      default:
        return null;
    }
  },
);

export const mockFindOneTrip = jest.fn(
  async ({ where: { launchId } }): Promise<any> => {
    switch (launchId) {
      case mockTrip.launchId: {
        return mockTrip;
      }
      case mockTrip2.launchId: {
        return mockTrip2;
      }
      case 90: {
        // simulates a failure to get a user's trip
        throw new Error('FAILURE TO GET USER TRIPS');
      }
      default:
        return null;
    }
  },
);
