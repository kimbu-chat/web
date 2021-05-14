import { eventChannel, SagaIterator } from 'redux-saga';
import { takeEvery, select, put, take, cancel, spawn } from 'redux-saga/effects';

import { authenticatedSelector } from '@store/auth/selectors';
import { createEmptyAction } from '@store/common/actions';

import { Logout } from '../../../auth/features/logout/logout';
import { ChangeUserOnlineStatus } from '../../../my-profile/features/change-user-online-status/change-user-online-status';

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

function* watcher(): SagaIterator {
  const visibilityChannel = createVisibilityChannel();
  const visibilityTask = yield takeEvery(
    visibilityChannel,
    function* changeOnlineStatus(action: boolean): SagaIterator {
      yield put(ChangeUserOnlineStatus.action(action));
    },
  );

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
      const authenticated = yield select(authenticatedSelector);

      if (!authenticated) {
        return;
      }

      yield spawn(watcher);
    };
  }
}
