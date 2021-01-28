import { Logout } from 'app/store/auth/features/logout/logout';
import { amIAuthenticatedSelector } from 'app/store/auth/selectors';
import { createEmptyAction } from 'app/store/common/actions';
import { ChangeUserOnlineStatus } from 'app/store/my-profile/features/change-user-online-status/change-user-online-status';
import { eventChannel, SagaIterator } from 'redux-saga';
import { takeEvery, select, put, take, cancel, spawn } from 'redux-saga/effects';

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
  const visibilityTask = yield takeEvery(visibilityChannel, function* (action: boolean) {
    yield put(ChangeUserOnlineStatus.action(action));
  });

  yield take(Logout.action);

  visibilityChannel.close();
  yield cancel(visibilityTask);
}

export class StartIdleStateChangeWatcher {
  static get action() {
    return createEmptyAction('START_IDLE_WATCHER');
  }

  static get saga() {
    return function* startIdleWatcher(): SagaIterator {
      const amIauthenticated = yield select(amIAuthenticatedSelector);

      if (!amIauthenticated) {
        return;
      }

      yield spawn(watcher);
    };
  }
}
