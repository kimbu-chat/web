import { AxiosResponse } from 'axios';
import { SagaIterator } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';

import { MAIN_API } from '@common/paths';
import { httpRequestFactory, HttpRequestMethod } from '@store/common/http';

import { Meta } from '../../../common/actions';

import { IRevokeSession } from './api-requests/revoke-session-api-request';
import { RevokeSessionSuccess } from './revoke-session-success';

export class RevokeSession {
  static get action() {
    return createAction('REVOKE_SESSION')<number, Meta>();
  }

  static get saga() {
    return function* addFriend(action: ReturnType<typeof RevokeSession.action>): SagaIterator {
      yield call(() => RevokeSession.httpRequest.generator({ sessionId: action.payload }));

      yield put(RevokeSessionSuccess.action(action.payload));

      action.meta.deferred?.resolve();
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse, IRevokeSession>(
      MAIN_API.USER_SESSIONS,
      HttpRequestMethod.Post,
    );
  }
}
