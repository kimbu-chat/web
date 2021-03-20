import { buffers, END, eventChannel, SagaIterator } from 'redux-saga';
import { call, cancel, put, race, select, spawn, take, takeEvery } from 'redux-saga/effects';
import { createEmptyAction } from '@store/common/actions';
import { getIsScreenSharingEnabledSelector } from '../../selectors';
import { getPeerConnection } from '../../../middlewares/webRTC/peerConnectionFactory';
import { getUserDisplay, setVideoSender, stopScreenSharingTracks, stopVideoTracks, tracks, getVideoSender } from '../../utils/user-media';
import { CloseScreenShareStatus } from './close-screen-share-status';
import { CloseVideoStatus } from '../change-user-media-status/close-video-status';
import { CallEndedEventHandler } from '../../socket-events/call-ended/call-ended-event-handler';
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
