import { SagaIterator } from '@redux-saga/core';
import produce from 'immer';
import { spawn, call } from 'redux-saga/effects';

import { createEmptyAction } from '@store/common/actions';
import { ILoginState } from '@store/login/login-state';

export class LoginSuccess {
  static get action() {
    return createEmptyAction('LOGIN_SUCCESS');
  }

  static get reducer() {
    return produce((draft: ILoginState) => ({
      ...draft,
      isAuthenticated: true,
    }));
  }

  static get saga() {
    return function* loginSuccessSaga(): SagaIterator {
      const { messaging } = yield call(() => import('@store/middlewares/firebase/firebase'));

      yield call(async () => messaging?.deleteToken());

      const { SubscribeToPushNotifications } = yield call(
        () =>
          import(
            '@store/notifications/features/subscribe-to-push-notifications/subscribe-to-push-notifications'
          ),
      );
      yield spawn(SubscribeToPushNotifications.saga);
    };
  }
}
