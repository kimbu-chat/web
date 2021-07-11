import produce from 'immer';
import { createAction } from 'typesafe-actions';

import { ICallsState } from '../../calls-state';
import { InputType } from '../../common/enums/input-type';

import { IChangeActiveDeviceIdActionPayload } from './action-payloads/change-active-device-id-action-payload';

// This feature action  is inwoked only when active device is already changed in order totrigger ui changes only
export class ChangeActiveDeviceId {
  static get action() {
    return createAction('CHANGE_ACTIVE_DEVICE_ID')<IChangeActiveDeviceIdActionPayload>();
  }

  static get reducer() {
    return produce(
      (draft: ICallsState, { payload }: ReturnType<typeof ChangeActiveDeviceId.action>) => {
        if (payload.kind === InputType.VideoInput) {
          draft.videoConstraints.deviceId = payload.deviceId;
        }

        if (payload.kind === InputType.AudioInput) {
          draft.audioConstraints.deviceId = payload.deviceId;
        }

        return draft;
      },
    );
  }
}
