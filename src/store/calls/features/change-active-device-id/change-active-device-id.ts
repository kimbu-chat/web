import { createAction } from '@reduxjs/toolkit';

import { ICallsState } from '../../calls-state';
import { InputType } from '../../common/enums/input-type';

import { IChangeActiveDeviceIdActionPayload } from './action-payloads/change-active-device-id-action-payload';

export class ChangeActiveDeviceId {
  static get action() {
    return createAction<IChangeActiveDeviceIdActionPayload>('CHANGE_ACTIVE_DEVICE_ID');
  }

  static get reducer() {
    return (draft: ICallsState, { payload }: ReturnType<typeof ChangeActiveDeviceId.action>) => {
      if (payload.kind === InputType.VideoInput) {
        draft.videoConstraints.deviceId = payload.deviceId;
      }

      if (payload.kind === InputType.AudioInput) {
        draft.audioConstraints.deviceId = payload.deviceId;
      }

      return draft;
    };
  }
}
