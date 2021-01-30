import { createEmptyAction } from 'app/store/common/actions';
import { httpRequestFactory, HttpRequestMethod } from 'app/store/common/http';
import { AxiosResponse } from 'axios';
import { SagaIterator } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import { resetPeerConnection } from 'app/store/middlewares/webRTC/peerConnectionFactory';
import { CancelCallSuccess } from './cancel-call-success';

export class CancelCall {
  static get action() {
    return createEmptyAction('CANCEL_CALL');
  }

  static get saga() {
    return function* cancelCallSaga(): SagaIterator {
      resetPeerConnection();

      yield call(() => CancelCall.httpRequest.generator());
      yield put(CancelCallSuccess.action());
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse>(`${process.env.MAIN_API}/api/calls/cancel-call`, HttpRequestMethod.Post);
  }
}
