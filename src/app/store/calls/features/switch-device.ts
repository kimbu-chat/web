import { RootState } from 'app/store/root-reducer';
import produce from 'immer';
import { SagaIterator } from 'redux-saga';
import { call, put, select } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import { SwitchDeviceActionPayload, CallState } from '../models';
import { getUserAudio, tracks, audioSender, getUserVideo, videoSender } from '../utils/user-media';
import { CloseAudioStatus } from './close-audio-status';
import { CloseVideoStatus } from './close-video-status';

export class SwitchDevice {
  static get action() {
    return createAction('SWITCH_DEVICE')<SwitchDeviceActionPayload>();
  }

  static get reducer() {
    return produce((draft: CallState, { payload }: ReturnType<typeof SwitchDevice.action>) => {
      if (payload.kind === 'videoinput') {
        draft.videoConstraints.deviceId = payload.deviceId;
      }

      if (payload.kind === 'audioinput') {
        draft.audioConstraints.deviceId = payload.deviceId;
      }

      return draft;
    });
  }

  static get saga() {
    return function* switchDeviceSaga(action: ReturnType<typeof SwitchDevice.action>): SagaIterator {
      const videoConstraints = yield select((state: RootState) => state.calls.videoConstraints);
      const audioConstraints = yield select((state: RootState) => state.calls.audioConstraints);

      if (action.payload.kind === 'audioinput' && audioConstraints.isOpened) {
        try {
          yield call(getUserAudio, { audio: audioConstraints });
        } catch (e) {
          if (e.message === 'NO_AUDIO') {
            yield put(CloseAudioStatus.action());
          }
        }

        if (tracks.audioTracks.length >= 0) {
          audioSender?.replaceTrack(tracks.audioTracks[0]);
        }
      }

      if (action.payload.kind === 'videoinput' && videoConstraints.isOpened) {
        try {
          yield call(getUserVideo, { video: videoConstraints });
        } catch (e) {
          if (e.message === 'NO_VIDEO') {
            yield put(CloseVideoStatus.action());
          }
        }

        if (tracks.videoTracks.length > 0) {
          videoSender?.replaceTrack(tracks.videoTracks[0]);
        }
      }
    };
  }
}
