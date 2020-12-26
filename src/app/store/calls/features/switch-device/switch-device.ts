import produce from 'immer';
import { SagaIterator } from 'redux-saga';
import { call, select } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import { getVideoConstraints, getAudioConstraints } from 'app/store/calls/selectors';
import { CallState } from '../../models';
import { getUserAudio, tracks, audioSender, getUserVideo, videoSender } from '../../utils/user-media';
import { SwitchDeviceActionPayload } from './switch-device-action-payload';
import { InputType } from '../../common/enums/input-type';

export class SwitchDevice {
  static get action() {
    return createAction('SWITCH_DEVICE')<SwitchDeviceActionPayload>();
  }

  static get reducer() {
    return produce((draft: CallState, { payload }: ReturnType<typeof SwitchDevice.action>) => {
      if (payload.kind === InputType.videoInput) {
        draft.videoConstraints.deviceId = payload.deviceId;
      }

      if (payload.kind === InputType.audioInput) {
        draft.audioConstraints.deviceId = payload.deviceId;
      }

      return draft;
    });
  }

  static get saga() {
    return function* switchDeviceSaga(action: ReturnType<typeof SwitchDevice.action>): SagaIterator {
      const videoConstraints = yield select(getVideoConstraints);
      const audioConstraints = yield select(getAudioConstraints);

      if (action.payload.kind === InputType.audioInput && audioConstraints.isOpened) {
        yield call(getUserAudio, { audio: audioConstraints });

        if (tracks.audioTracks.length >= 0) {
          audioSender?.replaceTrack(tracks.audioTracks[0]);
        }
      }

      if (action.payload.kind === InputType.videoInput && videoConstraints.isOpened) {
        yield call(getUserVideo, { video: videoConstraints });

        if (tracks.videoTracks.length > 0) {
          videoSender?.replaceTrack(tracks.videoTracks[0]);
        }
      }
    };
  }
}
