import produce from 'immer';
import { SagaIterator } from 'redux-saga';
import { createAction } from 'typesafe-actions';

import { SettingsService } from '@services/settings-service';
import { IUserSettings } from '@store/settings/user-settings-state';
import { apply } from 'redux-saga/effects';
import { applyTheme } from '@utils/apply-theme';
import { Theme } from '../models';

export class ChangeTheme {
  static get action() {
    return createAction('CHANGE_THEME')<Theme>();
  }

  static get reducer() {
    return produce((draft: IUserSettings, { payload }: ReturnType<typeof ChangeTheme.action>) => {
      draft.theme = payload;
      return draft;
    });
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
