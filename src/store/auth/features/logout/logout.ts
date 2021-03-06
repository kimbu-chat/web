import { createAction } from '@reduxjs/toolkit';
import { AxiosResponse } from 'axios';
import { SagaIterator } from 'redux-saga';
import { apply, call, put, select } from 'redux-saga/effects';

import { MAIN_API } from '@common/paths';
import { AuthService } from '@services/auth-service';
import { MyProfileService } from '@services/my-profile-service';
import { IAuthState } from '@store/auth/auth-state';
import { securityTokensSelector } from '@store/auth/selectors';
import { httpRequestFactory } from '@store/common/http/http-factory';
import { HttpRequestMethod } from '@store/common/http/http-request-method';
import { CloseWebsocketConnection } from '@store/internet/features/close-web-socket-connection/close-web-socket-connection';
import { ChangeUserOnlineStatus } from '@store/my-profile/features/change-user-online-status/change-user-online-status';

export class Logout {
  static get action() {
    return createAction('LOGOUT');
  }

  static get reducer() {
    return (draft: IAuthState) => {
      draft.loading = true;
    };
  }

  static get saga() {
    return function* logout(): SagaIterator {
      const securityTokens = yield select(securityTokensSelector);

      if (securityTokens) {
        yield put(ChangeUserOnlineStatus.action(false));
        yield put(CloseWebsocketConnection.action());
        yield call(() => Logout.httpRequest.generator());
      }

      const authService = new AuthService();
      const myProfileService = new MyProfileService();

      yield apply(authService, authService.clear, []);
      yield apply(myProfileService, myProfileService.clear, []);
      window.location.replace('/login');
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse>(MAIN_API.LOGOUT, HttpRequestMethod.Post);
  }
}
