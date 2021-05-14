import { SagaIterator } from 'redux-saga';
import { put, select } from 'redux-saga/effects';

import { authenticatedSelector } from '@store/auth/selectors';
import { createEmptyAction } from '@store/common/actions';

// eslint-disable-next-line max-len
import { StartInternetConnectionStateChangeWatcher } from '../../../internet/features/internet-connection-check/start-internet-connection-state-change-watcher';
import { ChangeUserOnlineStatus } from '../../../my-profile/features/change-user-online-status/change-user-online-status';
import { getUserSettingsAction } from '../../../settings/actions';
import { InitSocketConnection } from '../../../web-sockets/features/init-web-socked-connection/init-web-socket-connection';
import { StartIdleStateChangeWatcher } from '../start-idle-state-change-watcher/start-idle-state-change-watcher';

export class AppInit {
  static get action() {
    return createEmptyAction('INIT');
  }

  static get saga() {
    return function* initializeSaga(): SagaIterator {
      const authenticated = yield select(authenticatedSelector);

      if (!authenticated) {
        return;
      }

      yield put(ChangeUserOnlineStatus.action(true));
      yield put(InitSocketConnection.action());
      yield put(getUserSettingsAction());
      yield put(StartInternetConnectionStateChangeWatcher.action());
      yield put(StartIdleStateChangeWatcher.action());
    };
  }
}
