import { peerConnection } from 'app/store/middlewares/webRTC/peerConnectionFactory';
import { eventChannel, END, buffers } from 'redux-saga';
import { take, select, put, call } from 'redux-saga/effects';
import { getAudioDevices } from 'app/store/calls/selectors';
import { getMediaDevicesList } from './user-media';
import { ChangeMediaStatus } from '../features/change-user-media-status/change-media-status';
import { GotDevicesInfo } from '../features/got-devices-info/got-devices-info';
import { SwitchDevice } from '../features/switch-device/switch-device';
import { InputType } from '../common/enums/input-type';

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
    const audioDevices: MediaDeviceInfo[] = yield call(getMediaDevicesList, InputType.audioInput);
    const videoDevices: MediaDeviceInfo[] = yield call(getMediaDevicesList, InputType.videoInput);
    const prevAudioDevices = yield select(getAudioDevices);

    if (prevAudioDevices.length === 0) {
      yield put(SwitchDevice.action({ kind: InputType.audioInput, deviceId: audioDevices[0].deviceId }));
      yield put(ChangeMediaStatus.action({ kind: InputType.audioInput }));
    }

    yield put(GotDevicesInfo.action({ kind: InputType.audioInput, devices: audioDevices }));
    yield put(GotDevicesInfo.action({ kind: InputType.videoInput, devices: videoDevices }));
  }
}
