import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { IChangeActiveDeviceIdActionPayload } from './action-payloads/change-active-device-id-action-payload';
import { ICallsState } from '../../calls-state';
import { InputType } from '../../common/enums/input-type';

export class ChangeActiveDeviceId {
  static get action() {
    return createAction('CHANGE_ACTIVE_DEVICE_ID')<IChangeActiveDeviceIdActionPayload>();
  }

  static get reducer() {
    return produce((draft: ICallsState, { payload }: ReturnType<typeof ChangeActiveDeviceId.action>) => {
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
