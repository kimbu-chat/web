import { createAction } from 'typesafe-actions';
import produce from 'immer';

import { IUserSettings } from '@store/settings/user-settings-state';
import { SagaIterator } from 'redux-saga';
import { apply } from '@redux-saga/core/effects';
import { applyFontSize } from '@utils/apply-font-size';
import { IGetUserSettingsSuccessActionPayload } from './action-payloads/get-user-settings-success-action-payload';
import { Theme } from '../models';

export class GetUserSettingsSuccess {
  static get action() {
    return createAction('GET_USER_SETTINGS_SUCCESS')<
      IGetUserSettingsSuccessActionPayload | undefined
    >();
  }

  static get reducer() {
    return produce(
      (draft: IUserSettings, { payload }: ReturnType<typeof GetUserSettingsSuccess.action>) => ({
        ...draft,
        ...payload,
      }),
    );
  }

  static get saga() {
    return function* getUserSettingsSuccesSaga(
      action: ReturnType<typeof GetUserSettingsSuccess.action>,
    ): SagaIterator {
      yield apply(applyFontSize, applyFontSize, [action.payload?.fontSize]);

      if (action.payload?.theme === Theme.LIGHT) {
        const lightThemeColors: {
          [key: string]: string;
        } = {
          '--dt-grafit-wt-kingBlue': '#3F8AE0',
          '--dt-grafit-wt-white': '#fff',
          '--dt-grafit-wt-kingBlueLight-transparent': 'rgba(63, 138, 224, 0.25)',

          '--dt-dark-wt-white': '#fff',
          '--dt-dark-wt-bright-blue': '#D6E9FF',
          '--dt-dark-wt-kingBlueLight': 'rgba(63, 138, 224, 0.55)',
          '--dt-semi-transparent-wt-kingBlueLight': 'rgba(63, 138, 224, 0.55)',
          '--dt-dark-wt-kingBlue': '#3F8AE0',
          '--dt-dark-wt-whiter': 'rgba(214, 233, 255, 0.2)',
          '--dt-dark-wt-kingBlue-lighter': '#E8F1FB',
          '--dt-dark-wt-pink': '#FCE4E3',

          '--dt-dark-transparent-wt-kingBlueLight-transparent': 'rgba(63, 138, 224, 0.25)',

          '--upload-photo-progress': 'rgba(63, 138, 224, 0.55)',

          '--dt-white-wt-dark': '#4A5466',
          '--dt-white-wt-kingBlueLight': 'rgba(63, 138, 224, 0.55)',
          '--dt-white-wt-kingBlue': '#3F8AE0',
          '--dt-whiter-wt-bright-blue': '#D6E9FF',
          '--dt-whiter-wt-dark-kingBlue-transparentest': 'rgba(63, 138, 224, 0.08)',

          '--chat-bg-dt-dark-wt-whiter': '#f7fbff',
          '--chat-bg-dt-dark-wt-kingBlue': '#3F8AE0',
          '--chat-bg-dt-dark-wt-kingBlue-lighter': '#E8F1FB',
          '--chat-bg-dt-dark-wt-kingBlueLight': 'rgba(63, 138, 224, 0.55)',
          '--chat-bg-dt-dark-wt-kingBlueLight-transparent': 'rgba(63, 138, 224, 0.25)',
          '--chat-bg-dt-dark-wt-bright-blue': '#D6E9FF',

          '--dt-kingBlue-wt-kingBlueLight': 'rgba(63, 138, 224, 0.55)',
          '--dt-kingBlue-wt-grayLight': 'rgba(63, 138, 224, 0.12)',

          '--dt-transparent-white-wt-kingBlueLight-transparenter': 'rgba(214, 233, 255, 0.5)',

          '--msg-bg-dt-gray-lt-kingBlueLight': 'rgba(63, 138, 224, 0.55)',
          '--msg-bg-dt-gray-lt-grayLight': 'rgba(63, 138, 224, 0.12)',
          '--msg-bg-dt-gray-lt-kingBlue-lighter': '#E8F1FB',
          '--msg-bg-dt-gray-lt-bright-blue': '#D6E9FF',

          '--box-shadow-1': 'rgba(69, 107, 140, 0.5)',
          '--box-shadow-2': 'rgba(180, 180, 180, 0.7)',
          '--box-shadow-3': 'rgba(69, 107, 140, 0.5)',

          '--input-empty': 'rgba(63, 138, 224, 0.12)',
          '--input-hover': '#E8F1FB',
          '--input-active': '#D6E9FF',
          '--input-disabled': '#E5E5E5',
          '--input-placeholder': 'rgba(63, 138, 224, 0.25)',

          '--dt-semi-transparent-wt-kingBlue': '#3F8AE0',
          '--dt-semi-transparent-white-wt-kingBlueLight-transparent': 'rgba(63, 138, 224, 0.25)',
          '--dt-darker-wt-bright-blue': '#D6E9FF',
          '--blur-color': 'rgba(63, 138, 224, 0.25)',
          '--disabled-btn': '#7794B8',
          '--disabled-btn-text': 'rgba(255, 255, 255, 0.5)',
          '--disabled-input': '#E5E5E5', //
          '--radio-box-bg': '#E8F1FB',
          '--modals-bg': 'rgba(213, 225, 238, 0.41)',
          '--error-bg-themed': '#EEA39D',
          '--dt-blue-wt-grayLight': '#7794B8',
        };

        const root = document.documentElement;

        Object.keys(lightThemeColors).forEach((color) => {
          root.style.setProperty(color, lightThemeColors[color]);
        });
      }
    };
  }
}
