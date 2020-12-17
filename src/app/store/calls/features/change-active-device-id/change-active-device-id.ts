import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { ChangeActiveDeviceIdActionPayload } from './change-active-device-id-action-payload';
import { CallState } from '../../models';
import { InputType } from '../../common/enums/input-type';

export class ChangeActiveDeviceId {
  static get action() {
    return createAction('CHANGE_ACTIVE_DEVICE_ID')<ChangeActiveDeviceIdActionPayload>();
  }

  static get reducer() {
    return produce((draft: CallState, { payload }: ReturnType<typeof ChangeActiveDeviceId.action>) => {
      if (payload.kind === InputType.videoInput) {
        draft.videoConstraints.deviceId = payload.deviceId;
      }

      if (payload.kind === InputType.audioInput) {
        draft.audioConstraints.deviceId = payload.deviceId;
      }

      return draft;
    });
  }
}
