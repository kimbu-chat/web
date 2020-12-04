import { AuthService } from 'app/services/auth-service';
import { put, fork, spawn, take, select } from 'redux-saga/effects';
import { SagaIterator, eventChannel } from 'redux-saga';
import { RootState } from 'app/store/root-reducer';
import { FriendActions } from '../friends/actions';
import { SettingsActions } from '../settings/actions';
import { InternetConnectionCheck } from '../internet/features/internet-connection-check';
import { InitSocketConnection } from '../sockets/features/init-socket-connection';
import { ChangeUserOnlineStatus } from '../my-profile/features/change-user-online-status';
import { GetMyProfile } from '../my-profile/features/get-my-profile';

function createVisibilityChannel() {
  return eventChannel((emit) => {
    const change = () => {
      emit(!document.hidden);
    };
    const onBlur = () => emit(false);
    const onFocus = () => emit(true);

    document.addEventListener('visibilitychange', change);
    window.addEventListener('blur', onBlur);
    window.addEventListener('focus', onFocus);

    return () => {
      document.removeEventListener('visibilitychange', change);
      window.removeEventListener('blur', onBlur);
      window.removeEventListener('focus', onFocus);
    };
  });
}

function* watcher() {
  const channel = createVisibilityChannel();
  const amIauthenticated = yield select((state: RootState) => state.auth.isAuthenticated);
  while (true) {
    const action = (yield take(channel)) && amIauthenticated ? ChangeUserOnlineStatus.action(true) : ChangeUserOnlineStatus.action(false);
    yield put(action);
  }
}

export function* initializeSaga(): SagaIterator {
  const authService = new AuthService();
  const authData = authService.securityTokens;

  if (!authData) {
    return;
  }

  yield put(InitSocketConnection.action());
  yield put(SettingsActions.getUserSettingsAction());
  yield put(ChangeUserOnlineStatus.action(true));

  yield put(GetMyProfile.action());

  yield put(
    FriendActions.getFriends({
      page: { offset: 0, limit: 100 },
      initializedBySearch: false,
    }),
  );

  yield spawn(InternetConnectionCheck.saga);
  yield spawn(watcher);
}

export const InitiationSagas = [fork(initializeSaga)];
