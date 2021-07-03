import { SagaIterator } from 'redux-saga';
import { call, put, select } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';

import { getPeerConnection } from '../../../middlewares/webRTC/peerConnectionFactory';
import { InputType } from '../../common/enums/input-type';
import { getAudioConstraintsSelector, getVideoConstraintsSelector } from '../../selectors';
import {
  getAudioSender,
  getMediaDevicesList,
  getUserAudio,
  getUserVideo,
  setVideoSender,
  stopAudioTracks,
  stopScreenSharingTracks,
  stopVideoTracks,
  tracks,
  getVideoSender,
} from '../../utils/user-media';
import { ChangeActiveDeviceId } from '../change-active-device-id/change-active-device-id';
import { CloseScreenShareStatus } from '../change-screen-share-status/close-screen-share-status';
import { GotDevicesInfo } from '../got-devices-info/got-devices-info';

import { IChangeMediaStatusActionPayload } from './action-payloads/change-media-status-action-payload';
import { CloseAudioStatus } from './close-audio-status';
import { CloseVideoStatus } from './close-video-status';

export class ChangeMediaStatus {
  static get action() {
    return createAction('CHANGE_MEDIA_STATUS')<IChangeMediaStatusActionPayload>();
  }

  static get saga() {
    return function* changeMediaStatus(
      action: ReturnType<typeof ChangeMediaStatus.action>,
    ): SagaIterator {
      const videoConstraints = yield select(getVideoConstraintsSelector);
      const audioConstraints = yield select(getAudioConstraintsSelector);
      const peerConnection = getPeerConnection();
      const audioSender = getAudioSender();
      const videoSender = getVideoSender();

      if (action.payload.kind === InputType.VideoInput) {
        const isVideoOpened = !videoConstraints.isOpened;

        if (isVideoOpened) {
          yield call(getUserVideo, { video: { ...videoConstraints, isOpened: isVideoOpened } });

          if (videoSender) {
            videoSender?.replaceTrack(tracks.videoTrack);
          } else if (tracks.videoTrack) {
            setVideoSender(peerConnection?.addTrack(tracks.videoTrack) as RTCRtpSender);
          }

          stopScreenSharingTracks();
          yield put(CloseScreenShareStatus.action());
        } else {
          stopVideoTracks();
          yield put(CloseVideoStatus.action());

          if (videoSender) {
            peerConnection?.removeTrack(videoSender);
            setVideoSender(null);
          }
        }

        const videoDevices: MediaDeviceInfo[] = yield call(
          getMediaDevicesList,
          InputType.VideoInput,
        );

        if (videoDevices.length > 0) {
          yield put(GotDevicesInfo.action({ kind: InputType.VideoInput, devices: videoDevices }));
        }

        if (!videoConstraints.deviceId && videoDevices[0]) {
          yield put(
            ChangeActiveDeviceId.action({
              kind: InputType.VideoInput,
              deviceId: videoDevices[0].deviceId,
            }),
          );
        }
      }

      if (action.payload.kind === InputType.AudioInput) {
        const isAudioOpened = !audioConstraints.isOpened;

        if (isAudioOpened) {
          yield call(getUserAudio, {
            audio: { ...audioConstraints, isOpened: isAudioOpened },
          });

          if (tracks.audioTrack) {
            audioSender?.replaceTrack(tracks.audioTrack);
          }
        } else {
          audioSender?.replaceTrack(null);

          stopAudioTracks();
          yield put(CloseAudioStatus.action());
        }
      }
    };
  }
}
