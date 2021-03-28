import produce from 'immer';
import { SagaIterator } from 'redux-saga';
import { createAction } from 'typesafe-actions';

import { SettingsService } from '@services/settings-service';
import { IUserSettings } from '@store/settings/user-settings-state';

import { IChangeLanguageActionPayload } from './action-payloads/change-language-action-payload';
import { apply } from 'redux-saga/effects';

export class ChangeLanguage {
  static get action() {
    return createAction('CHANGE_LANGUAGE')<IChangeLanguageActionPayload>();
  }

  static get reducer() {
    return produce(
      (draft: IUserSettings, { payload }: ReturnType<typeof ChangeLanguage.action>) => {
        draft.language = payload.language;
        return draft;
      },
    );
  }

  static get saga() {
    return function* settingsServiceSaga(
      action: ReturnType<typeof ChangeLanguage.action>,
    ): SagaIterator {
      const settingsService = new SettingsService();
      yield apply(settingsService, settingsService.initializeOrUpdate, [{
        language: action.payload.language,
      }])
    };
  }
}
