import { AxiosResponse } from 'axios';
import { SagaIterator } from 'redux-saga';
import { call, put } from 'redux-saga/effects';

import { httpRequestFactory, HttpRequestMethod } from '@store/common/http';
import { resetPeerConnection } from '@store/middlewares/webRTC/reset-peer-connection';
import { createEmptyAction } from '@store/common/actions';

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
    return httpRequestFactory<AxiosResponse>(
      `${window.__config.REACT_APP_MAIN_API}/api/calls/cancel-call`,
      HttpRequestMethod.Post,
    );
  }
}
