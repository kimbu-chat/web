import { SagaIterator } from 'redux-saga';
import { call, put, spawn } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';

import { InputType } from '../../common/enums/input-type';
import { deviceUpdateWatcher } from '../../utils/device-update-watcher';
import { getMediaDevicesList } from '../../utils/user-media';
import { GotDevicesInfo } from '../got-devices-info/got-devices-info';

import { ISpawnDeviceUpdateWatcherActionPayload } from './action-payloads/spawn-device-update-watcher-action-payload';

export class SpawnDeviceUpdateWatcher {
  static get action() {
    return createAction('SPAWN_DEVICE_UPDATE_WATCHER')<ISpawnDeviceUpdateWatcherActionPayload>();
  }

  static get saga() {
    return function* outgoingCallSaga(
      action: ReturnType<typeof SpawnDeviceUpdateWatcher.action>,
    ): SagaIterator {
      const { audioOpened, videoOpened } = action.payload;

      yield spawn(deviceUpdateWatcher);

      if (audioOpened) {
        const audioDevices: MediaDeviceInfo[] = yield call(
          getMediaDevicesList,
          InputType.AudioInput,
        );

        if (audioDevices.length > 0) {
          yield put(GotDevicesInfo.action({ kind: InputType.AudioInput, devices: audioDevices }));
        }
      }

      if (videoOpened) {
        const videoDevices: MediaDeviceInfo[] = yield call(
          getMediaDevicesList,
          InputType.VideoInput,
        );

        if (videoDevices.length > 0) {
          yield put(GotDevicesInfo.action({ kind: InputType.VideoInput, devices: videoDevices }));
        }
      }
    };
  }
}
