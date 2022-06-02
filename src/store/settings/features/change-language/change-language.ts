import { createAction } from '@reduxjs/toolkit';
import { SagaIterator } from 'redux-saga';
import { apply } from 'redux-saga/effects';

import { SettingsService } from '@services/settings-service';
import { IUserSettings } from '@store/settings/user-settings-state';

import { IChangeLanguageActionPayload } from './action-payloads/change-language-action-payload';

export class ChangeLanguage {
  static get action() {
    return createAction<IChangeLanguageActionPayload>('CHANGE_LANGUAGE');
  }

  static get reducer() {
    return (draft: IUserSettings, { payload }: ReturnType<typeof ChangeLanguage.action>) => {
        draft.language = payload.language;
        return draft;
      }
  }

  static get saga() {
    return function* changeLanguageSaga(
      action: ReturnType<typeof ChangeLanguage.action>,
    ): SagaIterator {
      const settingsService = new SettingsService();
      yield apply(settingsService, settingsService.initializeOrUpdate, [
        {
          language: action.payload.language,
        },
      ]);
    };
  }
}
