import produce from 'immer';
import { SagaIterator } from 'redux-saga';
import { createAction } from 'typesafe-actions';

import { SettingsService } from '@services/settings-service';
import { IUserSettings } from '@store/settings/user-settings-state';
import { apply } from 'redux-saga/effects';
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
    return function* settingsServiceSaga(
      action: ReturnType<typeof ChangeTheme.action>,
    ): SagaIterator {
      const settingsService = new SettingsService();

      yield apply(settingsService, settingsService.initializeOrUpdate, [
        {
          theme: action.payload,
        },
      ]);

      const root = document.documentElement;

      root.style.setProperty('--dt-grafit-wt-kingBlue', '#3F8AE0');
      root.style.setProperty('--dt-grafit-wt-white', '#fff');
      root.style.setProperty(
        '--dt-grafit-wt-kingBlueLight-transparent',
        'rgba(63, 138, 224, 0.25)',
      );

      root.style.setProperty('--dt-dark-wt-white', '#fff');
      root.style.setProperty('--dt-dark-wt-bright-blue', '#D6E9FF');
      root.style.setProperty('--dt-dark-wt-grayLight', 'rgba(63, 138, 224, 0.12)');
      root.style.setProperty('--dt-dark-wt-kingBlueLight', 'rgba(63, 138, 224, 0.55)');
      root.style.setProperty('--dt-semi-transparent-wt-kingBlueLight', 'rgba(63, 138, 224, 0.55)');
      root.style.setProperty('--dt-dark-wt-kingBlue', '#3F8AE0');
      root.style.setProperty('--dt-dark-wt-whiter', 'rgba(214, 233, 255, 0.2)');
      root.style.setProperty('--dt-dark-wt-kingBlue-lighter', '#E8F1FB');
      root.style.setProperty('--dt-dark-wt-pink', '#FCE4E3');

      root.style.setProperty(
        '--dt-dark-transparent-wt-kingBlueLight-transparent',
        'rgba(63, 138, 224, 0.25)',
      );

      root.style.setProperty('--upload-photo-progress', 'rgba(63, 138, 224, 0.55)');

      root.style.setProperty('--dt-white-wt-dark', '#4A5466');
      root.style.setProperty('--dt-white-wt-kingBlueLight', 'rgba(63, 138, 224, 0.55)');
      root.style.setProperty('--dt-white-wt-kingBlue', '#3F8AE0');
      root.style.setProperty(
        '--dt-white-wt-kingBlueLight-transparenter',
        'rgba(214, 233, 255, 0.5)',
      );
      root.style.setProperty('--dt-whiter-wt-bright-blue', '#D6E9FF');

      root.style.setProperty('--chat-bg-dt-dark-wt-whiter', '#f7fbff');
      root.style.setProperty('--chat-bg-dt-dark-wt-kingBlue', '#3F8AE0');
      root.style.setProperty('--chat-bg-dt-dark-wt-kingBlue-lighter', '#E8F1FB');
      root.style.setProperty('--chat-bg-dt-dark-wt-kingBlueLight', 'rgba(63, 138, 224, 0.55)');
      root.style.setProperty(
        '--chat-bg-dt-dark-wt-kingBlueLight-transparent',
        'rgba(63, 138, 224, 0.25)',
      );
      root.style.setProperty(
        '--chat-bg-dt-dark-wt-kingBlueLight-transparenter',
        'rgba(214, 233, 255, 0.5)',
      );
      root.style.setProperty('--chat-bg-dt-dark-wt-bright-blue', '#D6E9FF');

      root.style.setProperty('--dt-kingBlue-wt-kingBlueLight', 'rgba(63, 138, 224, 0.55)');
      root.style.setProperty('--dt-kingBlue-wt-grayLight', 'rgba(63, 138, 224, 0.12)');

      root.style.setProperty(
        '--dt-transparent-white-wt-kingBlueLight-transparent',
        'rgba(63, 138, 224, 0.25)',
      );
      root.style.setProperty(
        '--dt-transparent-white-wt-kingBlueLight-transparenter',
        'rgba(214, 233, 255, 0.5)',
      );

      root.style.setProperty('--msg-bg-dt-gray-lt-kingBlueLight', 'rgba(63, 138, 224, 0.55)');
      root.style.setProperty('--msg-bg-dt-gray-lt-grayLight', 'rgba(63, 138, 224, 0.12)');
      root.style.setProperty('--msg-bg-dt-gray-lt-kingBlue-lighter', '#E8F1FB');
      root.style.setProperty('--msg-bg-dt-gray-lt-bright-blue', '#D6E9FF');

      root.style.setProperty('--box-shadow-1', 'rgba(69, 107, 140, 0.5)');
      root.style.setProperty('--box-shadow-2', 'rgba(180, 180, 180, 0.7)');
      root.style.setProperty('--box-shadow-3', 'rgba(69, 107, 140, 0.5)');

      root.style.setProperty('--input-empty', 'rgba(63, 138, 224, 0.12)');
      root.style.setProperty('--input-hover', '#E8F1FB');
      root.style.setProperty('--input-active', '#D6E9FF');
      root.style.setProperty('--input-disabled', '#E5E5E5');
      root.style.setProperty('--input-placeholder', 'rgba(63, 138, 224, 0.25)');

      root.style.setProperty('--dt-semi-transparent-wt-kingBlue', '#3F8AE0');
      root.style.setProperty(
        '--dt-semi-transparent-white-wt-kingBlueLight-transparent',
        'rgba(63, 138, 224, 0.25)',
      );
      root.style.setProperty('--dt-darker-wt-bright-blue', '#D6E9FF');
      root.style.setProperty('--blur-color', 'rgba(63, 138, 224, 0.25)');
      root.style.setProperty('--disabled-btn', '#7794B8');
      root.style.setProperty('--disabled-btn-text', 'rgba(255, 255, 255, 0.5)');
      root.style.setProperty('--disabled-input', '#E5E5E5'); //
      root.style.setProperty('--radio-box-bg', '#E8F1FB');
      root.style.setProperty('--modals-bg', 'rgba(213, 225, 238, 0.41)');
      root.style.setProperty('--error-bg-themed', '#EEA39D');
      root.style.setProperty('--dt-blue-wt-grayLight', '#7794B8');
    };
  }
}
