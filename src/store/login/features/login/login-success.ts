import { SagaIterator } from '@redux-saga/core';
import { createAction } from '@reduxjs/toolkit';
import { spawn } from 'redux-saga/effects';

import { ILoginState } from '@store/login/login-state';
import { subscribeToPushNotifications } from '@store/login/shared/subscribe-to-push-notifications';

export class LoginSuccess {
  static get action() {
    return createAction('LOGIN_SUCCESS');
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
