import { SagaIterator } from '@redux-saga/core';
import {createAction} from "@reduxjs/toolkit";
import { spawn } from 'redux-saga/effects';

import { subscribeToPushNotifications } from '@store/notifications/actions';

import { ILoginState } from '../../login-state';

export class LoginFromGoogleAccountSuccess {
  static get action() {
    return createAction('LOGIN_FROM_GOOGLE_ACCOUNT_SUCCESS');
  }

  static get reducer() {
    return (draft: ILoginState) => {
      draft.googleAuthLoading = false;

      return draft;
    };
  }

  static get saga() {
    return function* loginSuccessSaga(): SagaIterator {
      yield spawn(subscribeToPushNotifications);
    };
  }
}
