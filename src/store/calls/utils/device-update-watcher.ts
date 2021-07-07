import { buffers, eventChannel, SagaIterator } from 'redux-saga';
import { call, cancel, put, race, select, take, takeEvery } from 'redux-saga/effects';

import { InputType } from '../common/enums/input-type';
import { CancelCall } from '../features/cancel-call/cancel-call';
import { ChangeMediaStatus } from '../features/change-user-media-status/change-media-status';
import { DeclineCall } from '../features/decline-call/decline-call';
import { KillDeviceUpdateWatcher } from '../features/device-watcher/kill-device-update-watcher';
import { GotDevicesInfo } from '../features/got-devices-info/got-devices-info';
import { SwitchDevice } from '../features/switch-device/switch-device';
import { getAudioDevicesSelector, doIhaveCallSelector } from '../selectors';
import { CallEndedEventHandler } from '../socket-events/call-ended/call-ended-event-handler';

import { getMediaDevicesList } from './user-media';

function createDeviceUpdateChannel() {
  return eventChannel((emit) => {
    const onDeviceChange = (event: Event) => {
      emit(event);
    };

    navigator.mediaDevices.addEventListener('devicechange', onDeviceChange);

    return () => {
      navigator.mediaDevices.removeEventListener('devicechange', onDeviceChange);
    };
  }, buffers.expanding(10));
}

export function* deviceUpdateWatcher(): SagaIterator {
  const deviceUpdateChannel = createDeviceUpdateChannel();

  const deviceUpdateTask = yield takeEvery(
    deviceUpdateChannel,
    function* deviceUpdate(): SagaIterator {
      const audioDevices: MediaDeviceInfo[] = yield call(getMediaDevicesList, InputType.AudioInput);
      const videoDevices: MediaDeviceInfo[] = yield call(getMediaDevicesList, InputType.VideoInput);
      const prevAudioDevices = yield select(getAudioDevicesSelector);
      const isCallActive = yield select(doIhaveCallSelector);

      if (prevAudioDevices.length === 0 && audioDevices[0]) {
        yield put(
          SwitchDevice.action({ kind: InputType.AudioInput, deviceId: audioDevices[0].deviceId }),
        );

        if (isCallActive) {
          yield put(ChangeMediaStatus.action({ kind: InputType.AudioInput }));
        }
      }

      yield put(GotDevicesInfo.action({ kind: InputType.AudioInput, devices: audioDevices }));
      yield put(GotDevicesInfo.action({ kind: InputType.VideoInput, devices: videoDevices }));
    },
  );

  yield race({
    callEnded: take(CallEndedEventHandler.action),
    callCanceled: take(CancelCall.action),
    callDeclined: take(DeclineCall.action),
    killed: take(KillDeviceUpdateWatcher.action),
  });

  yield cancel(deviceUpdateTask);
  deviceUpdateChannel.close();
}
