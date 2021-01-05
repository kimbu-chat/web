import { amILoggedSelector } from 'app/store/auth/selectors';
import { httpRequestFactory } from 'app/store/common/http-factory';
import { HttpRequestMethod } from 'app/store/models';

import { AxiosResponse } from 'axios';
import { SagaIterator } from 'redux-saga';
import { call, select } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import { IChangeUserOnlineStatusApiRequest } from './api-requests/change-user-online-status-api-request';

export class ChangeUserOnlineStatus {
  static get action() {
    return createAction('CHANGE_ONLINE_STATUS')<boolean>();
  }

  static get saga() {
    return function* ({ payload }: ReturnType<typeof ChangeUserOnlineStatus.action>): SagaIterator {
      const isAuthenticated = yield select(amILoggedSelector);
      if (isAuthenticated) {
        try {
          ChangeUserOnlineStatus.httpRequest.call(yield call(() => ChangeUserOnlineStatus.httpRequest.generator({ isOnline: payload })));
        } catch (err) {
          alert(err);
        }
      }
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse, IChangeUserOnlineStatusApiRequest>(
      `${process.env.MAIN_API}/api/users/change-online-status`,
      HttpRequestMethod.Post,
    );
  }
}
