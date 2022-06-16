import { AxiosResponse } from 'axios';
import { ITerminateSessionRequest } from 'kimbu-models';
import { SagaIterator } from 'redux-saga';
import { call, put } from 'redux-saga/effects';

import { MAIN_API } from '@common/paths';
import { createDeferredAction } from '@store/common/actions';
import { httpRequestFactory, HttpRequestMethod } from '@store/common/http';

import { TerminateSessionSuccess } from './terminate-session-success';

export class TerminateSession {
  static get action() {
    return createDeferredAction<number>('TERMINATE_SESSION');
  }

  static get saga() {
    return function* terminateSessionSaga(
      action: ReturnType<typeof TerminateSession.action>,
    ): SagaIterator {
      yield call(() => TerminateSession.httpRequest.generator({ sessionId: action.payload }));

      yield put(TerminateSessionSuccess.action(action.payload));

      action.meta?.deferred?.resolve();
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse, ITerminateSessionRequest>(
      MAIN_API.TERMINATE_SESSION,
      HttpRequestMethod.Post,
    );
  }
}
