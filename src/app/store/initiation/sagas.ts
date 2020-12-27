import { AuthService } from 'app/services/auth-service';
import { put, fork, spawn, take, select, takeEvery, cancel } from 'redux-saga/effects';
import { SagaIterator, eventChannel } from 'redux-saga';
import { FRIENDS_LIMIT } from 'app/utils/pagination-limits';
import { FriendActions } from '../friends/actions';
import { SettingsActions } from '../settings/actions';
import { InternetConnectionCheck } from '../internet/features/internet-connection-check/internet-connection-check';
import { InitSocketConnection } from '../sockets/features/init-socked-connection/init-socket-connection';
import { ChangeUserOnlineStatus } from '../my-profile/features/change-user-online-status/change-user-online-status';
import { GetMyProfile } from '../my-profile/features/get-my-profile/get-my-profile';
import { amIlogged } from '../auth/selectors';
import { Logout } from '../auth/features/logout/logout';

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
  const visibilityChannel = createVisibilityChannel();

  const visibilityTask = yield takeEvery(visibilityChannel, function* () {
    const amIauthenticated = yield select(amIlogged);

    const action = amIauthenticated ? ChangeUserOnlineStatus.action(true) : ChangeUserOnlineStatus.action(false);
    yield put(action);
  });

  yield take(Logout.action);

  visibilityChannel.close();
  yield cancel(visibilityTask);

  console.log('visibilityChannel.close');
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
      page: { offset: 0, limit: FRIENDS_LIMIT },
      initializedBySearch: false,
    }),
  );

  yield spawn(InternetConnectionCheck.saga);
  yield spawn(watcher);
}

export const InitiationSagas = [fork(initializeSaga)];
