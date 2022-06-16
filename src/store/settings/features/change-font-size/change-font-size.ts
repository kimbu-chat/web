import { createAction } from '@reduxjs/toolkit';
import { SagaIterator } from 'redux-saga';
import { apply } from 'redux-saga/effects';

import { SettingsService } from '@services/settings-service';
import { IUserSettings } from '@store/settings/user-settings-state';

import { AllowedFontSize, isFontSizeAllowed } from '../models/allowed-font-size';

export class ChangeFontSize {
  static get action() {
    return createAction<AllowedFontSize>('CHANGE_FONT_SIZE');
  }

  static get reducer() {
    return (draft: IUserSettings, { payload }: ReturnType<typeof ChangeFontSize.action>) => {
      if (!isFontSizeAllowed(payload)) {
        return draft;
      }

      draft.fontSize = payload;

      return draft;
    };
  }

  static get saga() {
    return function* changeFontSizeSaga(
      action: ReturnType<typeof ChangeFontSize.action>,
    ): SagaIterator {
      if (!isFontSizeAllowed(action.payload)) {
        return;
      }

      const settingsService = new SettingsService();
      yield apply(settingsService, settingsService.initializeOrUpdate, [
        {
          fontSize: action.payload,
        },
      ]);

      const element =
        document.querySelector('#message-font-size') || document.createElement('style');
      element.id = 'message-font-size';
      element.innerHTML = `.message__content__text{ font-size: ${action.payload}px !important; }`;
      document.head.appendChild(element);
    };
  }
}
