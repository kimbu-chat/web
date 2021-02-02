import { SettingsService } from 'app/services/settings-service';
import { SagaIterator } from 'redux-saga';
import { select } from 'redux-saga/effects';
import produce from 'immer';
import { createEmptyAction } from 'store/common/actions';
import { areNotificationsEnabledSelector } from '../../selectors';
import { IUserSettings } from '../../user-settings-state';

export class ChangeNotificationSoundState {
  static get action() {
    return createEmptyAction('CHANGE_NOTIFICATIONS_SOUND_STATE');
  }

  static get reducer() {
    return produce((draft: IUserSettings) => {
      draft.notificationSound = !draft.notificationSound;
      return draft;
    });
  }

  static get saga() {
    return function* changeSoundNotificationsStateSaga(): SagaIterator {
      const state = yield select(areNotificationsEnabledSelector);
      new SettingsService().initializeOrUpdate({ notificationSound: state });
    };
  }
}
