import { MissionResponse } from 'data/api/model';

export default {
  Mission: {
    /**
     * This fetches the given mission size based on the provided value by the user.
     * defaults to LARGE if not specified
     */
    missionPatch: (mission: MissionResponse, { size } = { size: 'LARGE' }): string => {
      return size === 'SMALL' ? mission.missionPatchSmall : mission.missionPatchLarge;
    },
  },
};
