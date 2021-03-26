import { AxiosResponse } from 'axios';
import { SagaIterator } from 'redux-saga';
import { call, put, select } from 'redux-saga/effects';
import { httpRequestFactory, HttpRequestMethod } from '@store/common/http';
import { createEmptyAction } from '@store/common/actions';
import { resetPeerConnection } from '@store/middlewares/webRTC/reset-peer-connection';
import { getCallInterlocutorIdSelector } from '@store/calls/selectors';
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

      yield call(() => TimeoutCall.httpRequest.generator(request));

      resetPeerConnection();

      yield put(CancelCallSuccess.action());
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse>(
      `${process.env.MAIN_API}/api/calls/mark-call-as-not-answered`,
      HttpRequestMethod.Post,
    );
  }
}
