/* eslint-disable @typescript-eslint/ban-ts-comment */
import LaunchApi from './LaunchApi';
import { mockLaunchResponse, mockLaunch } from './mocks';

/**
 * There are mock Launches at the bottom of this file.
 * 1 mock for the RAW API reponse, and another
 * for the shape of the lauch after it would have been
 * transformed by the launch reducer.
 */

const mocks = {
  get: jest.fn(),
};

const ds = new LaunchApi();
// @ts-ignore
ds.get = mocks.get;

describe('[LaunchApi.launchReducer]', () => {
  it('properly transforms launch', () => {
    expect(ds.launchReducer(mockLaunchResponse)).toEqual(mockLaunch);
  });
});

describe('[LaunchApi.getAllLaunches]', () => {
  it('looks up launches from api', async () => {
    // if api response is list of raw launches,
    // res should be list of transformed launches
    mocks.get.mockReturnValueOnce([mockLaunchResponse]);
    const res = await ds.getAllLaunches();

    expect(res).toEqual([mockLaunch]);
    expect(mocks.get).toBeCalledWith('launches');
  });
});

describe('[LaunchApi.getLaunchById]', () => {
  it('should look up single launch from api', async () => {
    // if api response is list of raw launches,
    // res should be single transformed launch
    mocks.get.mockReturnValueOnce([mockLaunchResponse]);
    const res = await ds.getLaunchById(1);

    expect(res).toEqual(mockLaunch);
    expect(mocks.get).toBeCalledWith('launches', { flight_number: 1 });
  });
});

describe('[LaunchApi.getLaunchesByIds]', () => {
  it('should call getLaunchById for each id', async () => {
    // temporarily overwrite getLaunchById to test
    const { getLaunchById } = ds;
    // @ts-ignore
    ds.getLaunchById = jest.fn(() => ({ id: 1 }));

    const res = await ds.getLaunchesByIds([1, 2]);

    expect(res).toEqual([{ id: 1 }, { id: 1 }]);
    expect(ds.getLaunchById).toHaveBeenCalledTimes(2);

    // set getLaunchById back to default
    ds.getLaunchById = getLaunchById;
  });
});
