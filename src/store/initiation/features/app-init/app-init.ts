import { createAction } from '@reduxjs/toolkit';
import isEmpty from 'lodash/isEmpty';
import { SagaIterator } from 'redux-saga';
import { call, put } from 'redux-saga/effects';

import { AuthService } from '@services/auth-service';
import { AuthInit } from '@store/auth/features/initiate-auth/initiate-auth';
import { StartIdleStateChangeWatcher } from '@store/initiation/features/start-idle-state-change-watcher/start-idle-state-change-watcher';
import { InitSocketConnection } from '@store/internet/features/init-web-socked-connection/init-web-socket-connection';
import { StartInternetConnectionStateChangeWatcher } from '@store/internet/features/internet-connection-check/start-internet-connection-state-change-watcher';
import { ChangeUserOnlineStatus } from '@store/my-profile/features/change-user-online-status/change-user-online-status';
import { GetMyProfile } from '@store/my-profile/features/get-my-profile/get-my-profile';
import { getUserSettingsAction } from '@store/settings/actions';

export class AppInit {
  static get action() {
    return createAction('INIT');
  }

  static get saga() {
    return function* initializeSaga(): SagaIterator {
      const authService = new AuthService();
      if (isEmpty(authService.securityTokens)) {
        window.location.replace('login');
      }

      yield put(
        AuthInit.action({
          securityTokens: authService.securityTokens,
          deviceId: authService.deviceId,
        }),
      );
      yield put(GetMyProfile.action());
      yield put(ChangeUserOnlineStatus.action(true));
      yield put(InitSocketConnection.action());
      yield put(getUserSettingsAction());
      yield call(StartInternetConnectionStateChangeWatcher.saga);
      yield put(StartIdleStateChangeWatcher.action());
    };
  }
}
