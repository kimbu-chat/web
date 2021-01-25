import { AuthService } from 'app/services/auth-service';
import { createEmptyAction } from 'app/store/common/actions';
import { StartInternetConnectionStateChangeWatcher } from 'app/store/internet/features/internet-connection-check/start-internet-connection-state-change-watcher';
import { ChangeUserOnlineStatus } from 'app/store/my-profile/features/change-user-online-status/change-user-online-status';
import { GetMyProfile } from 'app/store/my-profile/features/get-my-profile/get-my-profile';
import { SettingsActions } from 'app/store/settings/actions';
import { InitSocketConnection } from 'app/store/sockets/features/init-socked-connection/init-socket-connection';
import { SagaIterator } from 'redux-saga';
import { put } from 'redux-saga/effects';
import { StartIdleWatcher } from '../start-idle-watcher/start-idle-watcher';

export class Init {
  static get action() {
    return createEmptyAction('INIT');
  }

  static get saga() {
    return function* initializeSaga(): SagaIterator {
      const authService = new AuthService();
      const { securityTokens } = authService;

      if (!securityTokens) {
        return;
      }

      yield put(InitSocketConnection.action());
      yield put(SettingsActions.getUserSettingsAction());
      yield put(ChangeUserOnlineStatus.action(true));

      yield put(GetMyProfile.action());

      // yield put(
      //   FriendActions.getFriends({
      //     page: { offset: 0, limit: FRIENDS_LIMIT },
      //     initializedBySearch: false,
      //   }),
      // );

      yield put(StartInternetConnectionStateChangeWatcher.action());

      yield put(StartIdleWatcher.action());
    };
  }
}
