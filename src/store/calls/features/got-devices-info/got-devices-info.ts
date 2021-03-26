import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { InputType } from '../../common/enums/input-type';
import { ICallsState } from '../../calls-state';
import { IGotDevicesInfoActionPayload } from './action-payloads/got-devices-info-action-payload';

export class GotDevicesInfo {
  static get action() {
    return createAction('GOT_DEVICES_INFO')<IGotDevicesInfoActionPayload>();
  }

  static get reducer() {
    return produce((draft: ICallsState, { payload }: ReturnType<typeof GotDevicesInfo.action>) => {
      if (payload.kind === InputType.VideoInput) {
        draft.videoDevicesList = payload.devices;
      }

      if (payload.kind === InputType.AudioInput) {
        draft.audioDevicesList = payload.devices;
      }

      return draft;
    });
  }
}
