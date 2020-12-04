import { createEmptyAction } from 'app/store/common/actions';
import { peerConnection } from 'app/store/middlewares/webRTC/peerConnectionFactory';
import { RootState } from 'app/store/root-reducer';
import produce from 'immer';
import { buffers, END, eventChannel, SagaIterator } from 'redux-saga';
import { call, put, select, spawn, take } from 'redux-saga/effects';
import { CallState } from '../models';
import { tracks, stopScreenSharingTracks, videoSender, setVideoSender, getUserDisplay, stopVideoTracks } from '../utils/user-media';
import { CloseScreenShareStatus } from './close-screen-share-status';

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
          emit(END);
        };
        tracks.screenSharingTracks[0].addEventListener('ended', onEnd);

        const clearIntervalCode = setInterval(() => {
          if (!tracks.screenSharingTracks[0]) {
            clearInterval(clearIntervalCode);
            emit(END);
          }
        }, 1000);

        return () => {
          if (tracks.screenSharingTracks[0]) {
            tracks.screenSharingTracks[0].removeEventListener('ended', onEnd);
          }
        };
      }, buffers.expanding(100));
    }

    function* trackEndedWatcher() {
      const channel = createTrackEndedChannel();
      while (true) {
        const action = yield take(channel);
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
      }
    }

    return function* (): SagaIterator {
      const screenSharingState = yield select((state: RootState) => state.calls.isScreenSharingOpened);
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
