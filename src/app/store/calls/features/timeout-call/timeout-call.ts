import { createEmptyAction } from 'app/store/common/actions';
import { httpRequestFactory } from 'app/store/common/http-factory';
import { HttpRequestMethod } from 'app/store/common/http-file-factory';
import { peerConnection, resetPeerConnection } from 'app/store/middlewares/webRTC/peerConnectionFactory';
import { ApiBasePath } from 'app/store/root-api';
import { RootState } from 'app/store/root-reducer';
import { AxiosResponse } from 'axios';
import { SagaIterator } from 'redux-saga';
import { call, put, select } from 'redux-saga/effects';
import { CallNotAnsweredApiRequest } from '../../models';
import { videoSender, setVideoSender, stopAllTracks } from '../../utils/user-media';
import { CancelCallSuccess } from '../cancel-call/cancel-call-success';

export class TimeoutCall {
  static get action() {
    return createEmptyAction('TIMEOUT_CALL');
  }

  static get saga() {
    return function* callNotAnsweredSaga(): SagaIterator {
      const interlocutorId: number = yield select((state: RootState) => state.calls.interlocutor?.id);

      const request = {
        interlocutorId,
      };

      TimeoutCall.httpRequest.call(yield call(() => TimeoutCall.httpRequest.generator(request)));

      if (videoSender) {
        try {
          peerConnection?.removeTrack(videoSender);
        } catch (e) {
          console.warn(e);
        }
        setVideoSender(null);
      }

      peerConnection?.close();
      resetPeerConnection();

      stopAllTracks();

      yield put(CancelCallSuccess.action());
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse, CallNotAnsweredApiRequest>(`${ApiBasePath.NotificationsApi}/api/calls/call-not-answered`, HttpRequestMethod.Post);
  }
}
