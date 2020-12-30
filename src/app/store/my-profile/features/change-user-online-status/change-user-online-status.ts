import { amIlogged } from 'app/store/auth/selectors';
import { httpRequestFactory } from 'app/store/common/http-factory';
import { HttpRequestMethod } from 'app/store/common/models';

import { AxiosResponse } from 'axios';
import { SagaIterator } from 'redux-saga';
import { call, select } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';

export class ChangeUserOnlineStatus {
  static get action() {
    return createAction('CHANGE_ONLINE_STATUS')<boolean>();
  }

  static get saga() {
    return function* ({ payload }: ReturnType<typeof ChangeUserOnlineStatus.action>): SagaIterator {
      const isAuthenticated = yield select(amIlogged);
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
    return httpRequestFactory<AxiosResponse, { isOnline: boolean }>(`${process.env.MAIN_API}/api/users/change-online-status`, HttpRequestMethod.Post);
  }
}
