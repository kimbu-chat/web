import { createAction } from '@reduxjs/toolkit';
import { SagaIterator } from 'redux-saga';
import { select } from 'redux-saga/effects';

import { SettingsService } from '@services/settings-service';
import { areNotificationsEnabledSelector } from '@store/settings/selectors';
import { IUserSettings } from '@store/settings/user-settings-state';

export class ChangeNotificationSoundState {
  static get action() {
    return createAction('CHANGE_NOTIFICATIONS_SOUND_STATE');
  }

  static get reducer() {
    return (draft: IUserSettings) => {
      draft.notificationSound = !draft.notificationSound;
      return draft;
    }
  }

  static get saga() {
    return function* changeSoundNotificationsStateSaga(): SagaIterator {
      const state = yield select(areNotificationsEnabledSelector);
      new SettingsService().initializeOrUpdate({ notificationSound: state });
    };
  }
}
