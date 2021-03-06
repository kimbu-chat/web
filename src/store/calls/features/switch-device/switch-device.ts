import { createAction } from '@reduxjs/toolkit';
import { SagaIterator } from 'redux-saga';
import { call, select } from 'redux-saga/effects';

import { ICallsState } from '../../calls-state';
import { InputType } from '../../common/enums/input-type';
import {
  doIhaveCallSelector,
  getAudioConstraintsSelector,
  getVideoConstraintsSelector,
} from '../../selectors';
import {
  getAudioSender,
  getUserAudio,
  getUserVideo,
  getVideoSender,
  tracks,
} from '../../utils/user-media';

import { ISwitchDeviceActionPayload } from './action-payloads/switch-device-action-payload';

export class SwitchDevice {
  static get action() {
    return createAction<ISwitchDeviceActionPayload>('SWITCH_DEVICE');
  }

  static get reducer() {
    return (draft: ICallsState, { payload }: ReturnType<typeof SwitchDevice.action>) => {
      if (payload.kind === InputType.VideoInput) {
        draft.videoConstraints.deviceId = payload.deviceId;
      }

      if (payload.kind === InputType.AudioInput) {
        draft.audioConstraints.deviceId = payload.deviceId;
      }

      return draft;
    };
  }

  static get saga() {
    return function* switchDeviceSaga(
      action: ReturnType<typeof SwitchDevice.action>,
    ): SagaIterator {
      const isCallActive = yield select(doIhaveCallSelector);

      if (isCallActive) {
        const videoConstraints = yield select(getVideoConstraintsSelector);
        const audioConstraints = yield select(getAudioConstraintsSelector);
        const audioSender = getAudioSender();
        const videoSender = getVideoSender();

        if (action.payload.kind === InputType.AudioInput && audioConstraints.isOpened) {
          yield call(getUserAudio, { audio: audioConstraints });

          if (tracks.audioTrack) {
            audioSender?.replaceTrack(tracks.audioTrack);
          }
        }

        if (action.payload.kind === InputType.VideoInput && videoConstraints.isOpened) {
          yield call(getUserVideo, { video: videoConstraints });

          if (tracks.videoTrack) {
            videoSender?.replaceTrack(tracks.videoTrack);
          }
        }
      }
    };
  }
}
