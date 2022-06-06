import { SagaIterator } from '@redux-saga/core';
import { spawn } from 'redux-saga/effects';

import { subscribeToPushNotifications } from '@store/notifications/actions';

import { ILoginState } from '../../login-state';
import {createAction} from "@reduxjs/toolkit";

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
