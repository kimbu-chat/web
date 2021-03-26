import { AxiosResponse } from 'axios';
import produce from 'immer';
import { SagaIterator } from 'redux-saga';
import { call, put, take } from 'redux-saga/effects';
import { authRequestFactory, HttpRequestMethod } from '@store/common/http';
import { CloseWebsocketConnection } from '@store/web-sockets/features/close-web-socket-connection/close-web-socket-connection';
import { createEmptyDefferedAction } from '@store/common/actions';
import { IAuthState } from '@store/auth/auth-state';
import { UnSubscribeFromPushNotifications } from '../un-subscribe-from-push-notifications/un-subscribe-from-push-notifications';
import { UnSubscribeToPushNotificationsSuccess } from '../un-subscribe-from-push-notifications/un-subscribe-from-push-notifications_success';

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
    return function* logout(action: ReturnType<typeof Logout.action>): SagaIterator {
      yield put(UnSubscribeFromPushNotifications.action());
      yield take(UnSubscribeToPushNotificationsSuccess.action);
      yield put(CloseWebsocketConnection.action());
      yield call(() => Logout.httpRequest.generator());
      localStorage.clear();
      action?.meta.deferred.resolve();
    };
  }

  static get httpRequest() {
    return authRequestFactory<AxiosResponse>(
      `${process.env.MAIN_API}/api/users/logout`,
      HttpRequestMethod.Post,
    );
  }
}
