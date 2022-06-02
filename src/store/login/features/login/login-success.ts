import { SagaIterator } from '@redux-saga/core';
import { spawn } from 'redux-saga/effects';

import { createEmptyAction } from '@store/common/actions';
import { ILoginState } from '@store/login/login-state';
import { subscribeToPushNotifications } from '@store/notifications/actions';

export class LoginSuccess {
  static get action() {
    return createEmptyAction('LOGIN_SUCCESS');
  }

  static get reducer() {
    return (draft: ILoginState) => {
      draft.isAuthenticated = true;
    };
  }

  static get saga() {
    return function* loginSuccessSaga(): SagaIterator {
      yield spawn(subscribeToPushNotifications);
    };
  }
}
