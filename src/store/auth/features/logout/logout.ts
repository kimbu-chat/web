import { AxiosResponse } from 'axios';
import produce from 'immer';
import { SagaIterator } from 'redux-saga';
import { call, put, select } from 'redux-saga/effects';

import { MAIN_API } from '@common/paths';
import { IAuthState } from '@store/auth/auth-state';
import { securityTokensSelector } from '@store/auth/selectors';
import { createEmptyAction } from '@store/common/actions';
import { httpRequestFactory } from '@store/common/http/http-factory';
import { HttpRequestMethod } from '@store/common/http/http-request-method';
import { ChangeUserOnlineStatus } from '@store/my-profile/features/change-user-online-status/change-user-online-status';
import { CloseWebsocketConnection } from '@store/web-sockets/features/close-web-socket-connection/close-web-socket-connection';

export class Logout {
  static get action() {
    return createEmptyAction('LOGOUT');
  }

  static get reducer() {
    return produce((draft: IAuthState) => ({
      ...draft,
      loading: true,
    }));
  }

  static get saga() {
    return function* logout(): SagaIterator {
      const securityTokens = yield select(securityTokensSelector);

      if (securityTokens) {
        yield call(() => ChangeUserOnlineStatus.httpRequest.generator({ isOnline: false }));
        yield put(CloseWebsocketConnection.action());
        yield call(() => Logout.httpRequest.generator());
      }

      localStorage.clear();
      window.location.replace('/login');
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse>(MAIN_API.LOGOUT, HttpRequestMethod.Post);
  }
}
