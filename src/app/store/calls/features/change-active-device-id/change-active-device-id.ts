import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { ChangeActiveDeviceIdActionPayload } from './change-active-device-id-action-payload';
import { CallState } from '../../models';

export class ChangeActiveDeviceId {
  static get action() {
    return createAction('CHANGE_ACTIVE_DEVICE_ID')<ChangeActiveDeviceIdActionPayload>();
  }

  static get reducer() {
    return produce((draft: CallState, { payload }: ReturnType<typeof ChangeActiveDeviceId.action>) => {
      if (payload.kind === 'videoinput') {
        draft.videoConstraints.deviceId = payload.deviceId;
      }

      if (payload.kind === 'audioinput') {
        draft.audioConstraints.deviceId = payload.deviceId;
      }

      return draft;
    });
  }
}
