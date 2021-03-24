import produce from 'immer';
import { SagaIterator } from 'redux-saga';
import { createAction } from 'typesafe-actions';

import { SettingsService } from '@services/settings-service';
import { IUserSettings } from '@store/settings/user-settings-state';
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
    return function* settingsServiceSaga(action: ReturnType<typeof ChangeTheme.action>): SagaIterator {
      const settingsService = new SettingsService();
      settingsService.initializeOrUpdate({
        theme: action.payload,
      });
    };
  }
}
