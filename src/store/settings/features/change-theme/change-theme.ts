import { createAction } from '@reduxjs/toolkit';
import { SagaIterator } from 'redux-saga';
import { apply } from 'redux-saga/effects';

import { SettingsService } from '@services/settings-service';
import { IUserSettings } from '@store/settings/user-settings-state';
import { applyTheme } from '@utils/apply-theme';

import { Theme } from '../models';

export class ChangeTheme {
  static get action() {
    return createAction<Theme>('CHANGE_THEME');
  }

  static get reducer() {
    return (draft: IUserSettings, { payload }: ReturnType<typeof ChangeTheme.action>) => {
      draft.theme = payload;
      return draft;
    };
  }

  static get saga() {
    return function* changeThemeSaga(action: ReturnType<typeof ChangeTheme.action>): SagaIterator {
      const settingsService = new SettingsService();

      yield apply(settingsService, settingsService.initializeOrUpdate, [
        {
          theme: action.payload,
        },
      ]);

      yield apply(applyTheme, applyTheme, [action.payload]);
    };
  }
}
