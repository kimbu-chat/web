import produce from 'immer';
import { SagaIterator } from 'redux-saga';
import { createAction } from 'typesafe-actions';

import { SettingsService } from '@services/settings-service';
import { IUserSettings } from '@store/settings/user-settings-state';

import { IChangeLanguageActionPayload } from './action-payloads/change-language-action-payload';

export class ChangeLanguage {
  static get action() {
    return createAction('CHANGE_LANGUAGE')<IChangeLanguageActionPayload>();
  }

  static get reducer() {
    return produce((draft: IUserSettings, { payload }: ReturnType<typeof ChangeLanguage.action>) => {
      draft.language = payload.language;
      return draft;
    });
  }

  static get saga() {
    return function* settingsServiceSaga(action: ReturnType<typeof ChangeLanguage.action>): SagaIterator {
      const settingsService = new SettingsService();
      settingsService.initializeOrUpdate({
        language: action.payload.language,
      });
    };
  }
}