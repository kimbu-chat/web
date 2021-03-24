import produce from 'immer';
import { SagaIterator } from 'redux-saga';
import { createAction } from 'typesafe-actions';

import { SettingsService } from '@services/settings-service';
import { IUserSettings } from '@store/settings/user-settings-state';
import { AllowedFontSize } from '../models';

export class ChangeFontSize {
  static get action() {
    return createAction('CHANGE_FONT_SIZE')<AllowedFontSize>();
  }

  static get reducer() {
    return produce((draft: IUserSettings, { payload }: ReturnType<typeof ChangeFontSize.action>) => {
      draft.fontSize = payload;
      return draft;
    });
  }

  static get saga() {
    return function* settingsServiceSaga(action: ReturnType<typeof ChangeFontSize.action>): SagaIterator {
      const settingsService = new SettingsService();
      settingsService.initializeOrUpdate({
        fontSize: action.payload,
      });

      const element = document.querySelector('#message-font-size') || document.createElement('style');
      element.id = 'message-font-size';
      element.innerHTML = `.message__content span{ font-size: ${action.payload}px; }`;
      document.head.appendChild(element);
    };
  }
}
