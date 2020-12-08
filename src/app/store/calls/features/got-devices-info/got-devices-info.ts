import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { CallState } from '../../models';
import { GotDevicesInfoActionPayload } from './got-devices-info-action-payload';

export class GotDevicesInfo {
  static get action() {
    return createAction('GOT_DEVICES_INFO')<GotDevicesInfoActionPayload>();
  }

  static get reducer() {
    return produce((draft: CallState, { payload }: ReturnType<typeof GotDevicesInfo.action>) => {
      if (payload.kind === 'videoinput') {
        draft.videoDevicesList = payload.devices;
      }

      if (payload.kind === 'audioinput') {
        draft.audioDevicesList = payload.devices;
      }

      return draft;
    });
  }
}
