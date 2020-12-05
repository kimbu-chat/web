import { SettingsService } from 'app/services/settings-service';
import { SagaIterator } from 'redux-saga';
import { put } from 'redux-saga/effects';
import { createEmptyAction } from '../../../common/actions';
import { GetUserSettingsSuccess } from './get-user-settings-success';

export class GetUserSettings {
  static get action() {
    return createEmptyAction('GET_USER_SETTINGS');
  }

  static get saga() {
    return function* (): SagaIterator {
      console.log('sagasaga');
      const savedSettings = new SettingsService().settings;
      yield put(GetUserSettingsSuccess.action(savedSettings));
    };
  }
}
