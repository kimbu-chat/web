import { AxiosResponse } from 'axios';
import produce from 'immer';
import { SagaIterator } from 'redux-saga';
import { call, put, select } from 'redux-saga/effects';

import { MAIN_API } from '@common/paths';
import { IAuthState } from '@store/auth/auth-state';
import { securityTokensSelector } from '@store/auth/selectors';
import { createEmptyDefferedAction } from '@store/common/actions';
import { httpRequestFactory, HttpRequestMethod } from '@store/common/http';
import { UnSubscribeFromPushNotifications } from '@store/notifications/features/un-subscribe-from-push-notifications/un-subscribe-from-push-notifications';
import { UnSubscribeToPushNotificationsSuccess } from '@store/notifications/features/un-subscribe-from-push-notifications/un-subscribe-from-push-notifications_success';
import { CloseWebsocketConnection } from '@store/web-sockets/features/close-web-socket-connection/close-web-socket-connection';

export class Logout {
  static get action() {
    return createEmptyDefferedAction('LOGOUT');
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
