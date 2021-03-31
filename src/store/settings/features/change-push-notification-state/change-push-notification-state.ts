import { SagaIterator } from 'redux-saga';
import { select } from 'redux-saga/effects';
import produce from 'immer';

import { SettingsService } from '@services/settings-service';
import { createEmptyAction } from '@store/common/actions';
import { arePushNotificationsEnabledSelector } from '@store/settings/selectors';
import { IUserSettings } from '@store/settings/user-settings-state';

export class ChangePushNotificationState {
  static get action() {
    return createEmptyAction('CHANGE_PUSH_NOTIFICATIONS_STATE');
  }

  static get reducer() {
    return produce((draft: IUserSettings) => {
      draft.pushNotificationsEnabled = !draft.pushNotificationsEnabled;
      return draft;
    });
  }

  static get saga() {
    return function* changeSoundNotificationsStateSaga(): SagaIterator {
      const state = yield select(arePushNotificationsEnabledSelector);
      new SettingsService().initializeOrUpdate({ pushNotificationsEnabled: state });
    };
  }
}
