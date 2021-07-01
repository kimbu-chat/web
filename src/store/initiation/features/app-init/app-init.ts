import { SagaIterator } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import isEmpty from 'lodash/isEmpty';
import produce from 'immer';

import { createEmptyAction } from '@store/common/actions';
import { AuthService } from '@services/auth-service';
import { AuthInit } from '@store/auth/features/initiate-auth/initiate-auth';
import { GetMyProfile } from '@store/my-profile/features/get-my-profile/get-my-profile';

import { StartInternetConnectionStateChangeWatcher } from '../../../internet/features/internet-connection-check/start-internet-connection-state-change-watcher';
import { ChangeUserOnlineStatus } from '../../../my-profile/features/change-user-online-status/change-user-online-status';
import { getUserSettingsAction } from '../../../settings/actions';
import { InitSocketConnection } from '../../../web-sockets/features/init-web-socked-connection/init-web-socket-connection';
import { StartIdleStateChangeWatcher } from '../start-idle-state-change-watcher/start-idle-state-change-watcher';

export class AppInit {
  static get action() {
    return createEmptyAction('INIT');
  }

  static get reducer() {
    return produce((draft) => draft);
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
