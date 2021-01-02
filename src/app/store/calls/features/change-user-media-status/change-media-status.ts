import { peerConnection } from 'app/store/middlewares/webRTC/peerConnectionFactory';
import { SagaIterator } from 'redux-saga';
import { call, put, select } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import { getAudioConstraints, getVideoConstraints } from 'app/store/calls/selectors';
import {
  audioSender,
  getMediaDevicesList,
  getUserAudio,
  getUserVideo,
  setVideoSender,
  stopAudioTracks,
  stopScreenSharingTracks,
  stopVideoTracks,
  tracks,
  videoSender,
} from '../../utils/user-media';
import { ChangeActiveDeviceId } from '../change-active-device-id/change-active-device-id';
import { GotDevicesInfo } from '../got-devices-info/got-devices-info';
import { IChangeMediaStatusActionPayload } from './change-media-status-action-payload';
import { InputType } from '../../common/enums/input-type';
import { CloseScreenShareStatus } from '../change-screen-share-status/close-screen-share-status';
import { CloseAudioStatus } from './close-audio-status';
import { CloseVideoStatus } from './close-video-status';

export class ChangeMediaStatus {
  static get action() {
    return createAction('CHANGE_MEDIA_STATUS')<IChangeMediaStatusActionPayload>();
  }

  static get saga() {
    return function* (action: ReturnType<typeof ChangeMediaStatus.action>): SagaIterator {
      const videoConstraints = yield select(getVideoConstraints);
      const audioConstraints = yield select(getAudioConstraints);

      if (action.payload.kind === InputType.VideoInput) {
        const isVideoOpened = !videoConstraints.isOpened;

        if (isVideoOpened) {
          yield call(getUserVideo, { video: { ...videoConstraints, isOpened: isVideoOpened } });

          if (videoSender) {
            console.log('video track replaced', tracks.videoTrack);
            videoSender?.replaceTrack(tracks.videoTrack);
          } else if (tracks.videoTrack) {
            setVideoSender(peerConnection?.addTrack(tracks.videoTrack) as RTCRtpSender);
            console.log('video track added', tracks.videoTrack);
          }

          stopScreenSharingTracks();
          yield put(CloseScreenShareStatus.action());
        } else {
          stopVideoTracks();
          yield put(CloseVideoStatus.action());

          console.log('video off');

          if (videoSender) {
            videoSender.replaceTrack(null);
            console.log('video track removed');
          }
        }

        const videoDevices: MediaDeviceInfo[] = yield call(getMediaDevicesList, InputType.VideoInput);

        if (videoDevices.length > 0) {
          yield put(GotDevicesInfo.action({ kind: InputType.VideoInput, devices: videoDevices }));
        }

        if (!videoConstraints.deviceId && videoDevices[0]) {
          yield put(ChangeActiveDeviceId.action({ kind: InputType.VideoInput, deviceId: videoDevices[0].deviceId }));
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

          yield call(stopAudioTracks);
          yield put(CloseAudioStatus.action());
        }
      }
    };
  }
}
