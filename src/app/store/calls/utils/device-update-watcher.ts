import { peerConnection } from 'app/store/middlewares/webRTC/peerConnectionFactory';
import { RootState } from 'app/store/root-reducer';
import { eventChannel, END, buffers } from 'redux-saga';
import { take, select, put, call } from 'redux-saga/effects';
import { getMediaDevicesList } from './user-media';
import { ChangeMediaStatus } from '../features/change-media-status/change-media-status';
import { GotDevicesInfo } from '../features/got-devices-info/got-devices-info';
import { SwitchDevice } from '../features/switch-device/switch-device';

function deviceUpdateChannel() {
  return eventChannel((emit) => {
    const onDeviceChange = (event: Event) => {
      emit(event);
    };

    const clearIntervalCode = setInterval(() => {
      const state = peerConnection?.connectionState;
      if (!state || state === 'closed' || state === 'disconnected') {
        clearInterval(clearIntervalCode);
        emit(END);
      }
    }, 1000);

    navigator.mediaDevices.addEventListener('devicechange', onDeviceChange);

    return () => {
      navigator.mediaDevices.removeEventListener('devicechange', onDeviceChange);
    };
  }, buffers.expanding(10));
}

export function* deviceUpdateWatcher() {
  const channel = deviceUpdateChannel();
  while (true) {
    yield take(channel);
    const audioDevices: MediaDeviceInfo[] = yield call(getMediaDevicesList, 'audioinput');
    const videoDevices: MediaDeviceInfo[] = yield call(getMediaDevicesList, 'videoinput');
    const prevAudioDevices = yield select((state: RootState) => state.calls.audioDevicesList);

    if (prevAudioDevices.length === 0) {
      yield put(SwitchDevice.action({ kind: 'audioinput', deviceId: audioDevices[0].deviceId }));
      yield put(ChangeMediaStatus.action({ kind: 'audioinput' }));
    }

    yield put(GotDevicesInfo.action({ kind: 'audioinput', devices: audioDevices }));
    yield put(GotDevicesInfo.action({ kind: 'videoinput', devices: videoDevices }));
  }
}
