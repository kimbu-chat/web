import { createAction } from '@reduxjs/toolkit';

import { ICallsState } from '../../calls-state';
import { InputType } from '../../common/enums/input-type';

import { IGotDevicesInfoActionPayload } from './action-payloads/got-devices-info-action-payload';

export class GotDevicesInfo {
  static get action() {
    return createAction<IGotDevicesInfoActionPayload>('GOT_DEVICES_INFO');
  }

  static get reducer() {
    return (draft: ICallsState, { payload }: ReturnType<typeof GotDevicesInfo.action>) => {
      if (payload.kind === InputType.VideoInput) {
        draft.videoDevicesList = payload.devices;
      }

      if (payload.kind === InputType.AudioInput) {
        draft.audioDevicesList = payload.devices;
      }

      return draft;
    };
  }
}
