import { SagaIterator } from 'redux-saga';
import { put } from 'redux-saga/effects';
import { SettingsService } from '@services/settings-service';
import { createEmptyAction } from '@store/common/actions';

import { GetUserSettingsSuccess } from './get-user-settings-success';

export class GetUserSettings {
  static get action() {
    return createEmptyAction('GET_USER_SETTINGS');
  }

  static get saga() {
    return function* userSettings(): SagaIterator {
      const savedSettings = new SettingsService().settings;
      yield put(GetUserSettingsSuccess.action(savedSettings));
    };
  }
}
