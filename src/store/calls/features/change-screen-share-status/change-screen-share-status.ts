import { buffers, END, eventChannel, SagaIterator } from 'redux-saga';
import { call, cancel, put, race, select, spawn, take, takeEvery } from 'redux-saga/effects';

import { getPeerConnection } from '@store/middlewares/webRTC/peerConnectionFactory';
import { getIsScreenSharingEnabledSelector } from '../../selectors';
import { CallEndedEventHandler } from '../../socket-events/call-ended/call-ended-event-handler';
import {
  getUserDisplay,
  setVideoSender,
  stopScreenSharingTracks,
  stopVideoTracks,
  tracks,
  getVideoSender,
} from '../../utils/user-media';
import { CancelCall } from '../cancel-call/cancel-call';
import { CloseVideoStatus } from '../change-user-media-status/close-video-status';
import { DeclineCall } from '../decline-call/decline-call';

import { CloseScreenShareStatus } from './close-screen-share-status';
import {createAction} from "@reduxjs/toolkit";

export class ChangeScreenShareStatus {
  static get action() {
    return createAction('CHANGE_SCREEN_SHARE_STATUS');
  }

  static get saga() {
    // user can end screen sharing without even interracting with UI using system button
    // that's why we listen for this event
    function createTrackEndedChannel() {
      return eventChannel((emit) => {
        const onEnd = () => {
          emit(true);
          emit(END);
        };

        if (tracks.screenSharingTrack) {
          tracks.screenSharingTrack.addEventListener('ended', onEnd);
        }

        // if event was triggered by user or call ended  then we kill the instance of wtcher and remove event listener
        return () => {
          if (tracks.screenSharingTrack) {
            tracks.screenSharingTrack.removeEventListener('ended', onEnd);
          }
        };
      }, buffers.expanding(100));
    }

    function* trackEndedWatcher(): SagaIterator {
      const trackEndedChannel = createTrackEndedChannel();
      const peerConnection = getPeerConnection();
      const videoSender = getVideoSender();

      const trackEndedTask = yield takeEvery(trackEndedChannel, function* closeScreenShare(action) {
        if (action === true) {
          stopScreenSharingTracks();
          yield put(CloseScreenShareStatus.action());

          if (videoSender) {
            peerConnection?.removeTrack(videoSender);
            setVideoSender(null);
          }

          yield put(CloseScreenShareStatus.action());
        }
      });

      // if close sharingevent was triggered by user or call ended  then we kill the instance of wtcher and remove event listener
      yield race({
        canceled: take(CancelCall.action),
        interlocutorCanceled: take(CallEndedEventHandler.action),
        declined: take(DeclineCall.action),
        videoStatusClosed: take(CloseVideoStatus.action),
        videoStatusChanged: take(ChangeScreenShareStatus.action),
      });

      trackEndedChannel.close();
      yield cancel(trackEndedTask);
    }

    return function* screenSharing(): SagaIterator {
      const isScreenSharingOpened = !(yield select(getIsScreenSharingEnabledSelector));
      const peerConnection = getPeerConnection();
      const videoSender = getVideoSender();

      if (isScreenSharingOpened) {
        yield call(getUserDisplay);

        if (!tracks.screenSharingTrack) {
          return;
        }

        stopVideoTracks();
        yield put(CloseVideoStatus.action());

        if (videoSender) {
          videoSender?.replaceTrack(tracks.screenSharingTrack);
        } else if (tracks.screenSharingTrack) {
          setVideoSender(peerConnection?.addTrack(tracks.screenSharingTrack) as RTCRtpSender);
        }

        if (tracks.screenSharingTrack) {
          yield spawn(trackEndedWatcher);
        }
      } else if (tracks.screenSharingTrack) {
        stopScreenSharingTracks();
        yield put(CloseScreenShareStatus.action());

        if (videoSender) {
          peerConnection?.removeTrack(videoSender);
          setVideoSender(null);
        }
      }
    };
  }
}
