import { peerConnection } from 'app/store/middlewares/webRTC/peerConnectionFactory';
import produce from 'immer';
import { SagaIterator } from 'redux-saga';
import { select, put, call, actionChannel, take } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import { getVideoConstraints, getAudioConstraints } from 'app/store/calls/selectors';
import { CallState } from '../../models';
import {
  getUserVideo,
  videoSender,
  tracks,
  setVideoSender,
  stopScreenSharingTracks,
  stopVideoTracks,
  getMediaDevicesList,
  getUserAudio,
  audioSender,
} from '../../utils/user-media';
import { ChangeActiveDeviceId } from '../change-active-device-id/change-active-device-id';
import { CloseAudioStatus } from './close-audio-status';
import { CloseVideoStatus } from './close-video-status';
import { GotDevicesInfo } from '../got-devices-info/got-devices-info';
import { ChangeMediaStatusActionPayload } from './change-media-status-action-payload';
import { InputType } from '../../common/enums/input-type';
import { GetUserMediaError } from '../../common/enums/get-user-media-error';

export class ChangeMediaStatus {
  static get action() {
    return createAction('CHANGE_MEDIA_STATUS')<ChangeMediaStatusActionPayload>();
  }

  static get reducer() {
    return produce((draft: CallState, { payload }: ReturnType<typeof ChangeMediaStatus.action>) => {
      if (payload.kind === InputType.videoInput) {
        draft.isScreenSharingOpened = false;
        draft.videoConstraints.isOpened = !draft.videoConstraints.isOpened;
      }

      if (payload.kind === InputType.audioInput) {
        draft.audioConstraints.isOpened = !draft.audioConstraints.isOpened;
      }

      return draft;
    });
  }

  static get saga() {
    return function* (): SagaIterator {
      const requestChan = yield actionChannel(ChangeMediaStatus.action);

      while (true) {
        const { payload } = yield take(requestChan);

        const videoConstraints = yield select(getVideoConstraints);
        const audioConstraints = yield select(getAudioConstraints);

        if (payload.kind === InputType.videoInput) {
          if (videoConstraints.isOpened) {
            if (videoConstraints.isOpened) {
              try {
                yield call(getUserVideo, { video: videoConstraints });
              } catch (e) {
                if (e.message === GetUserMediaError.NO_VIDEO) {
                  yield put(CloseVideoStatus.action());
                }
              }
            }

            if (videoSender) {
              videoSender?.replaceTrack(tracks.videoTracks[0]);
            } else if (tracks.videoTracks[0]) {
              setVideoSender(peerConnection?.addTrack(tracks.videoTracks[0]) as RTCRtpSender);
            }

            stopScreenSharingTracks();
          } else if (tracks.videoTracks.length > 0) {
            stopVideoTracks();
            console.log('video off');
            if (videoSender) {
              try {
                peerConnection?.removeTrack(videoSender);
              } catch (e) {
                console.warn(e);
              }
              setVideoSender(null);
            }
          }

          const videoDevices: MediaDeviceInfo[] = yield call(getMediaDevicesList, InputType.videoInput);
          yield put(GotDevicesInfo.action({ kind: InputType.videoInput, devices: videoDevices }));

          if (!videoConstraints.deviceId && videoDevices[0]) {
            yield put(ChangeActiveDeviceId.action({ kind: InputType.videoInput, deviceId: videoDevices[0].deviceId }));
          }
        }
        if (payload.kind === InputType.audioInput) {
          if (audioConstraints.isOpened) {
            try {
              yield call(getUserAudio, {
                audio: audioConstraints,
              });
            } catch (e) {
              if (e.message === GetUserMediaError.NO_AUDIO) {
                yield put(CloseAudioStatus.action());
              }
            }

            if (tracks.audioTracks.length >= 0) {
              audioSender?.replaceTrack(tracks.audioTracks[0]);
            }
          } else {
            tracks.audioTracks.forEach((track) => track.stop());
            tracks.audioTracks = [];
            audioSender?.replaceTrack(null);
          }
        }
      }
    };
  }
}
