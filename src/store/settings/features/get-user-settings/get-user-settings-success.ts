import { createAction } from '@reduxjs/toolkit';
import { SagaIterator } from 'redux-saga';
import { apply } from 'redux-saga/effects';

import { IUserSettings } from '@store/settings/user-settings-state';
import { applyFontSize } from '@utils/apply-font-size';
import { applyTheme } from '@utils/apply-theme';

import { IGetUserSettingsSuccessActionPayload } from './action-payloads/get-user-settings-success-action-payload';

export class GetUserSettingsSuccess {
  static get action() {
    return createAction<IGetUserSettingsSuccessActionPayload | undefined>('GET_USER_SETTINGS_SUCCESS');
  }

  static get reducer() {
    return (draft: IUserSettings, { payload }: ReturnType<typeof GetUserSettingsSuccess.action>) => ({
        ...draft,
        ...payload,
      });
  }

  static get saga() {
    return function* getUserSettingsSuccesSaga(
      action: ReturnType<typeof GetUserSettingsSuccess.action>,
    ): SagaIterator {
      yield apply(applyFontSize, applyFontSize, [action.payload?.fontSize]);

      yield apply(applyTheme, applyTheme, [action.payload?.theme]);
    };
  }
}
