import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { IChangeActiveDeviceIdActionPayload } from './change-active-device-id-action-payload';
import { ICallState } from '../../models';
import { InputType } from '../../common/enums/input-type';

export class ChangeActiveDeviceId {
  static get action() {
    return createAction('CHANGE_ACTIVE_DEVICE_ID')<IChangeActiveDeviceIdActionPayload>();
  }

  static get reducer() {
    return produce((draft: ICallState, { payload }: ReturnType<typeof ChangeActiveDeviceId.action>) => {
      if (payload.kind === InputType.VideoInput) {
        draft.videoConstraints.deviceId = payload.deviceId;
      }

      if (payload.kind === InputType.AudioInput) {
        draft.audioConstraints.deviceId = payload.deviceId;
      }

      return draft;
    });
  }
}
