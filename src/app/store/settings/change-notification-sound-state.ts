import { SettingsService } from 'app/services/settings-service';
import { SagaIterator } from 'redux-saga';
import { select } from 'redux-saga/effects';
import produce from 'immer';
import { createEmptyAction } from '../common/actions';
import { UserSettings } from './models';
import { areNotificationsEnabled } from './selectors';

export class ChangeNotificationSoundState {
  static get action() {
    return createEmptyAction('CHANGE_NOTIFICATIONS_SOUND_STATE');
  }

  static get reducer() {
    return produce(function (draft: UserSettings) {
      draft.notificationSound = !draft.notificationSound;
      return draft;
    });
  }

  static get saga() {
    return function* changeSoundNotificationsStateSaga(): SagaIterator {
      const state = yield select(areNotificationsEnabled);
      new SettingsService().initializeOrUpdate({ notificationSound: state });
    };
  }
}
