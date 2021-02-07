import produce from 'immer';
import { SagaIterator } from 'redux-saga';
import { put, take } from 'redux-saga/effects';
import { createEmptyDefferedAction } from 'store/common/actions';
import { IAuthState } from '../../auth-state';
import { UnSubscribeFromPushNotifications } from '../un-subscribe-from-push-notifications/un-subscribe-from-push-notifications';
import { UnSubscribeToPushNotificationsSuccess } from '../un-subscribe-from-push-notifications/un-subscribe-from-push-notifications_success';

export class Logout {
  static get action() {
    return createEmptyDefferedAction('LOGOUT');
  }

  static get reducer() {
    return produce((draft: IAuthState) => ({
      ...draft,
      loading: true,
    }));
  }

  static get saga() {
    return function* (action: ReturnType<typeof Logout.action>): SagaIterator {
      yield put(UnSubscribeFromPushNotifications.action());
      yield take(UnSubscribeToPushNotificationsSuccess.action);
      // todo: send logout request
      localStorage.clear();
      action?.meta.deferred.resolve();
    };
  }
}
