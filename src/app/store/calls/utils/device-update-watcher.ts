import { DeclineCall } from 'app/store/calls/features/decline-call/decline-call';
import { buffers, eventChannel } from 'redux-saga';
import { call, cancel, put, race, select, take, takeEvery } from 'redux-saga/effects';
import { getAudioDevices } from 'app/store/calls/selectors';
import { getMediaDevicesList } from './user-media';
import { ChangeMediaStatus } from '../features/change-user-media-status/change-media-status';
import { GotDevicesInfo } from '../features/got-devices-info/got-devices-info';
import { SwitchDevice } from '../features/switch-device/switch-device';
import { InputType } from '../common/enums/input-type';
import { CancelCall } from '../features/cancel-call/cancel-call';
import { CallEndedEventHandler } from '../socket-events/call-ended/call-ended-event-handler';

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

export function* deviceUpdateWatcher() {
  const deviceUpdateChannel = createDeviceUpdateChannel();

  const deviceUpdateTask = yield takeEvery(deviceUpdateChannel, function* () {
    const audioDevices: MediaDeviceInfo[] = yield call(getMediaDevicesList, InputType.audioInput);
    const videoDevices: MediaDeviceInfo[] = yield call(getMediaDevicesList, InputType.videoInput);
    const prevAudioDevices = yield select(getAudioDevices);

    if (prevAudioDevices.length === 0) {
      yield put(SwitchDevice.action({ kind: InputType.audioInput, deviceId: audioDevices[0].deviceId }));
      yield put(ChangeMediaStatus.action({ kind: InputType.audioInput }));
    }

    yield put(GotDevicesInfo.action({ kind: InputType.audioInput, devices: audioDevices }));
    yield put(GotDevicesInfo.action({ kind: InputType.videoInput, devices: videoDevices }));
  });

  yield race({
    callEnded: take(CallEndedEventHandler.action),
    callCanceled: take(CancelCall.action),
    callDeclined: take(DeclineCall.action),
  });

  yield cancel(deviceUpdateTask);
  deviceUpdateChannel.close();
}
