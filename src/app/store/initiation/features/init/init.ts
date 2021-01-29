import { ISecurityTokens } from 'app/store/auth/models';
import { selectSecurityTokensSelector } from 'app/store/auth/selectors';
import { createEmptyAction } from 'app/store/common/actions';
import { StartInternetConnectionStateChangeWatcher } from 'app/store/internet/features/internet-connection-check/start-internet-connection-state-change-watcher';
import { ChangeUserOnlineStatus } from 'app/store/my-profile/features/change-user-online-status/change-user-online-status';
import { SettingsActions } from 'app/store/settings/actions';
import { InitSocketConnection } from 'app/store/sockets/features/init-socked-connection/init-socket-connection';
import { SagaIterator } from 'redux-saga';
import { put, select } from 'redux-saga/effects';
import { StartIdleStateChangeWatcher } from '../start-idle-state-change-watcher/start-idle-state-change-watcher';

export class Init {
  static get action() {
    return createEmptyAction('INIT');
  }

  static get saga() {
    return function* initializeSaga(): SagaIterator {
      const securityTokens: ISecurityTokens = yield select(selectSecurityTokensSelector);

      if (!securityTokens) {
        return;
      }

      yield put(ChangeUserOnlineStatus.action(true));
      yield put(InitSocketConnection.action());
      yield put(SettingsActions.getUserSettingsAction());
      yield put(StartInternetConnectionStateChangeWatcher.action());
      yield put(StartIdleStateChangeWatcher.action());
    };
  }
}
