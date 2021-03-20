import produce from 'immer';
import { SagaIterator } from 'redux-saga';
import { call, select } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import { getAudioConstraintsSelector, getVideoConstraintsSelector } from '../../selectors';
import { ICallsState } from '../../calls-state';
import { getVideoSender, getUserAudio, getUserVideo, tracks, getAudioSender } from '../../utils/user-media';
import { ISwitchDeviceActionPayload } from './action-payloads/switch-device-action-payload';
import { InputType } from '../../common/enums/input-type';

export class SwitchDevice {
  static get action() {
    return createAction('SWITCH_DEVICE')<ISwitchDeviceActionPayload>();
  }

  static get reducer() {
    return produce((draft: ICallsState, { payload }: ReturnType<typeof SwitchDevice.action>) => {
      if (payload.kind === InputType.VideoInput) {
        draft.videoConstraints.deviceId = payload.deviceId;
      }

      if (payload.kind === InputType.AudioInput) {
        draft.audioConstraints.deviceId = payload.deviceId;
      }

      return draft;
    });
  }

  static get saga() {
    return function* switchDeviceSaga(action: ReturnType<typeof SwitchDevice.action>): SagaIterator {
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
    };
  }
}
