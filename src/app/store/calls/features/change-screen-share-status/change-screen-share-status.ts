import { createEmptyAction } from 'app/store/common/actions';
import { peerConnection } from 'app/store/middlewares/webRTC/peerConnectionFactory';
import { buffers, END, eventChannel, SagaIterator } from 'redux-saga';
import { call, cancel, put, race, select, spawn, take, takeEvery } from 'redux-saga/effects';
import { getIsScreenSharingEnabled } from 'app/store/calls/selectors';
import { getUserDisplay, setVideoSender, stopScreenSharingTracks, stopVideoTracks, tracks, videoSender } from '../../utils/user-media';
import { CloseScreenShareStatus } from './close-screen-share-status';
import { CloseVideoStatus } from '../change-user-media-status/close-video-status';
import { CallEnded } from '../end-call/call-ended';
import { CancelCall } from '../cancel-call/cancel-call';
import { DeclineCall } from '../decline-call/decline-call';

export class ChangeScreenShareStatus {
  static get action() {
    return createEmptyAction('CHANGE_SCREEN_SHARE_STATUS');
  }

  static get saga() {
    function createTrackEndedChannel() {
      return eventChannel((emit) => {
        const onEnd = () => {
          emit(true);
          console.log('trackEndedchannel closed');
          emit(END);
        };

        if (tracks.screenSharingTrack) {
          tracks.screenSharingTrack.addEventListener('ended', onEnd);
        }

        return () => {
          if (tracks.screenSharingTrack) {
            tracks.screenSharingTrack.removeEventListener('ended', onEnd);
          }
        };
      }, buffers.expanding(100));
    }

    function* trackEndedWatcher() {
      const trackEndedChannel = createTrackEndedChannel();

      const trackEndedTask = yield takeEvery(trackEndedChannel, function* (action) {
        if (action === true) {
          stopScreenSharingTracks();
          yield put(CloseScreenShareStatus.action());

          if (videoSender) {
            videoSender.replaceTrack(null);
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
      yield cancel(trackEndedTask);
      console.log('trackEndedchannel.close');
    }

    return function* (): SagaIterator {
      const isScreenSharingOpened = !(yield select(getIsScreenSharingEnabled));

      if (isScreenSharingOpened) {
        yield call(getUserDisplay);

        yield call(stopVideoTracks);
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
          videoSender.replaceTrack(null);
        }
      }
    };
  }
}
