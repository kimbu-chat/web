import { createEmptyAction } from 'app/store/common/actions';
import { peerConnection } from 'app/store/middlewares/webRTC/peerConnectionFactory';
import produce from 'immer';
import { buffers, END, eventChannel, SagaIterator } from 'redux-saga';
import { call, put, race, select, spawn, take, takeEvery } from 'redux-saga/effects';
import { getIsScreenSharingEnabled } from 'app/store/calls/selectors';
import { CallState } from '../../models';
import { tracks, stopScreenSharingTracks, videoSender, setVideoSender, getUserDisplay, stopVideoTracks } from '../../utils/user-media';
import { CloseScreenShareStatus } from './close-screen-share-status';
import { CloseVideoStatus } from '../change-user-media-status/close-video-status';
import { CallEnded } from '../end-call/call-ended';
import { CancelCall } from '../cancel-call/cancel-call';
import { DeclineCall } from '../decline-call/decline-call';

export class ChangeScreenShareStatus {
  static get action() {
    return createEmptyAction('CHANGE_SCREEN_SHARE_STATUS');
  }

  static get reducer() {
    return produce((draft: CallState) => {
      draft.isScreenSharingOpened = !draft.isScreenSharingOpened;
      draft.videoConstraints.isOpened = false;
      return draft;
    });
  }

  static get saga() {
    function createTrackEndedChannel() {
      return eventChannel((emit) => {
        const onEnd = () => {
          emit(true);
          console.log('trackEndedchannel closed');
          emit(END);
        };

        tracks.screenSharingTracks[0].addEventListener('ended', onEnd);

        return () => {
          if (tracks.screenSharingTracks[0]) {
            tracks.screenSharingTracks[0].removeEventListener('ended', onEnd);
          }
        };
      }, buffers.expanding(100));
    }

    function* trackEndedWatcher() {
      const trackEndedChannel = createTrackEndedChannel();

      yield takeEvery(trackEndedChannel, function* (action) {
        if (action === true) {
          stopScreenSharingTracks();

          if (videoSender) {
            try {
              peerConnection?.removeTrack(videoSender);
            } catch (e) {
              console.warn(e);
            }
            setVideoSender(null);
          }

          yield put(CloseScreenShareStatus.action());
        }
      });

      yield race({
        canceled: take(CancelCall.action),
        interlocutorCanceled: take(CallEnded.action),
        declined: take(DeclineCall.action),
        videoStatusClosed: take(CloseVideoStatus.action),
        videoStatusChanged: take(ChangeScreenShareStatus.action),
      });

      trackEndedChannel.close();
      console.log('trackEndedchannel.close');
    }

    return function* (): SagaIterator {
      const screenSharingState = yield select(getIsScreenSharingEnabled);
      let isErrorPresent = false;

      if (screenSharingState) {
        try {
          yield call(getUserDisplay);
        } catch (e) {
          if (e.message === 'NO_DISPLAY') {
            yield put(CloseScreenShareStatus.action());
            isErrorPresent = true;
          }
        }

        stopVideoTracks();

        if (!isErrorPresent) {
          if (videoSender) {
            videoSender?.replaceTrack(tracks.screenSharingTracks[0]);
          } else if (tracks.screenSharingTracks[0]) {
            setVideoSender(peerConnection?.addTrack(tracks.screenSharingTracks[0]) as RTCRtpSender);
          }

          yield spawn(trackEndedWatcher);
        } else if (videoSender) {
          try {
            peerConnection?.removeTrack(videoSender);
          } catch (e) {
            console.warn(e);
          }
          setVideoSender(null);
        }
      } else if (tracks.screenSharingTracks.length > 0) {
        stopScreenSharingTracks();

        if (videoSender) {
          try {
            peerConnection?.removeTrack(videoSender);
          } catch (e) {
            console.warn(e);
          }
          setVideoSender(null);
        }
      }
    };
  }
}
