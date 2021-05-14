import { SagaIterator } from 'redux-saga';
import { select, put, call } from 'redux-saga/effects';

import { SettingsService } from '@services/settings-service';
import { arePushNotificationsEnabledSelector } from '@store/settings/selectors';
import { createEmptyDefferedAction } from '@store/common/actions';

import { UnSubscribeFromPushNotifications } from '../../../auth/features/un-subscribe-from-push-notifications/un-subscribe-from-push-notifications';
import { SubscribeToPushNotifications } from '../../../auth/features/subscribe-to-push-notifications/subscribe-to-push-notifications';

import { ChangePushNotificationStateSuccess } from './change-push-notification-state-success';

export class ChangePushNotificationState {
  static get action() {
    return createEmptyDefferedAction('CHANGE_PUSH_NOTIFICATIONS_STATE');
  }

  static get saga() {
    return function* changeSoundNotificationsStateSaga(
      action: ReturnType<typeof ChangePushNotificationState.action>,
    ): SagaIterator {
      const state = yield select(arePushNotificationsEnabledSelector);
      new SettingsService().initializeOrUpdate({ pushNotificationsEnabled: state });

      if (state) {
        yield call(UnSubscribeFromPushNotifications.saga);
      } else {
        yield call(SubscribeToPushNotifications.saga);
      }
      yield put(ChangePushNotificationStateSuccess.action());
      action.meta.deferred.resolve();
    };
  }
}
