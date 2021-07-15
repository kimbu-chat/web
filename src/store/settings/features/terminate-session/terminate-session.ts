import { AxiosResponse } from 'axios';
import { SagaIterator } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';

import { MAIN_API } from '@common/paths';
import { httpRequestFactory, HttpRequestMethod } from '@store/common/http';

import { Meta } from '../../../common/actions';

import { ITerminateSession } from './api-requests/terminate-session-api-request';
import { TerminateSessionSuccess } from './terminate-session-success';

export class TerminateSession {
  static get action() {
    return createAction('TERMINATE_SESSION')<number, Meta>();
  }

  static get saga() {
    return function* terminateSessionSaga(
      action: ReturnType<typeof TerminateSession.action>,
    ): SagaIterator {
      yield call(() => TerminateSession.httpRequest.generator({ sessionId: action.payload }));

      yield put(TerminateSessionSuccess.action(action.payload));

      action.meta.deferred?.resolve();
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse, ITerminateSession>(
      MAIN_API.TERMINATE_SESSION,
      HttpRequestMethod.Post,
    );
  }
}
