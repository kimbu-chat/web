import { peerConnection } from 'app/store/middlewares/webRTC/peerConnectionFactory';
import { SagaIterator } from 'redux-saga';
import { select, put, call } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import { getVideoConstraints, getAudioConstraints } from 'app/store/calls/selectors';
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
  stopAudioTracks,
} from '../../utils/user-media';
import { ChangeActiveDeviceId } from '../change-active-device-id/change-active-device-id';
import { GotDevicesInfo } from '../got-devices-info/got-devices-info';
import { ChangeMediaStatusActionPayload } from './change-media-status-action-payload';
import { InputType } from '../../common/enums/input-type';
import { CloseScreenShareStatus } from '../change-screen-share-status/close-screen-share-status';
import { CloseAudioStatus } from './close-audio-status';
import { CloseVideoStatus } from './close-video-status';

export class ChangeMediaStatus {
  static get action() {
    return createAction('CHANGE_MEDIA_STATUS')<ChangeMediaStatusActionPayload>();
  }

  static get saga() {
    return function* (action: ReturnType<typeof ChangeMediaStatus.action>): SagaIterator {
      const videoConstraints = yield select(getVideoConstraints);
      const audioConstraints = yield select(getAudioConstraints);

      if (action.payload.kind === InputType.videoInput) {
        const isVideoOpened = !videoConstraints.isOpened;

        if (isVideoOpened) {
          yield call(getUserVideo, { video: { ...videoConstraints, isOpened: isVideoOpened } });

          if (videoSender) {
            console.log('video track replaced', tracks.videoTracks.length);
            videoSender?.replaceTrack(tracks.videoTracks[0]);
          } else if (tracks.videoTracks.length > 0) {
            setVideoSender(peerConnection?.addTrack(tracks.videoTracks[0]) as RTCRtpSender);
            console.log('video track added');
          }

          stopScreenSharingTracks();
          yield put(CloseScreenShareStatus.action());
        } else if (tracks.videoTracks.length > 0) {
          stopVideoTracks();
          yield put(CloseVideoStatus.action());

          console.log('video off');

          if (videoSender) {
            peerConnection?.removeTrack(videoSender);
            console.log('video track removed');
            setVideoSender(null);
          }
        }

        const videoDevices: MediaDeviceInfo[] = yield call(getMediaDevicesList, InputType.videoInput);

        if (videoDevices.length > 0) {
          yield put(GotDevicesInfo.action({ kind: InputType.videoInput, devices: videoDevices }));
        }

        if (!videoConstraints.deviceId && videoDevices[0]) {
          yield put(ChangeActiveDeviceId.action({ kind: InputType.videoInput, deviceId: videoDevices[0].deviceId }));
        }
      }

      if (action.payload.kind === InputType.audioInput) {
        const isAudioOpened = !audioConstraints.isOpened;

        if (isAudioOpened) {
          yield call(getUserAudio, {
            audio: { ...audioConstraints, isOpened: isAudioOpened },
          });

          if (tracks.audioTracks.length >= 0) {
            audioSender?.replaceTrack(tracks.audioTracks[0]);
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
