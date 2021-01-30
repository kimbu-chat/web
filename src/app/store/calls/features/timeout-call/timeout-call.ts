import { createEmptyAction } from 'app/store/common/actions';
import { httpRequestFactory, HttpRequestMethod } from 'app/store/common/http';
import { resetPeerConnection } from 'app/store/middlewares/webRTC/peerConnectionFactory';

import { AxiosResponse } from 'axios';
import { SagaIterator } from 'redux-saga';
import { call, put, select } from 'redux-saga/effects';
import { getCallInterlocutorIdSelector } from 'app/store/calls/selectors';
import { CancelCallSuccess } from '../cancel-call/cancel-call-success';

export class TimeoutCall {
  static get action() {
    return createEmptyAction('TIMEOUT_CALL');
  }

  static get saga() {
    return function* timeoutCallSaga(): SagaIterator {
      const interlocutorId: number = yield select(getCallInterlocutorIdSelector);

      const request = {
        interlocutorId,
      };

      TimeoutCall.httpRequest.call(yield call(() => TimeoutCall.httpRequest.generator(request)));

      resetPeerConnection();

      yield put(CancelCallSuccess.action());
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse>(`${process.env.MAIN_API}/api/calls/mark-call-as-not-answered`, HttpRequestMethod.Post);
  }
}
