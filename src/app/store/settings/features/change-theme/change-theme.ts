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

      const root = document.documentElement;

      root.style.setProperty('--dt-grafit-wt-kingBlue', '#3F8AE0');
      root.style.setProperty('--dt-grafit-wt-white', '#fff');
      root.style.setProperty('--dt-dark-wt-white', '#fff');
      root.style.setProperty('--dt-white-wt-dark', '#4A5466');
      root.style.setProperty('--chat-bg-dt-dark-wt-whiter', '#f7fbff'); // rgba(214, 233, 255, 0.2)
      root.style.setProperty('--dt-kingBlue-wt-kingBlueLight', 'rgba(63, 138, 224, 0.55)');
      root.style.setProperty('--msg-bg-dt-gray-lt-grayLight', 'rgba(63, 138, 224, 0.12)');
      root.style.setProperty('--dt-white-wt-kingBlue', '#3F8AE0');
      root.style.setProperty('--dt-semi-transparent-wt-kingBlue', '#3F8AE0');
      root.style.setProperty('--dt-white-wt-kingBlueLight-transparenter', 'rgba(214, 233, 255, 0.5)');
    };
  }
}
