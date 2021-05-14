import { createAction } from 'typesafe-actions';
import produce from 'immer';
import { SagaIterator } from 'redux-saga';
import { apply } from 'redux-saga/effects';

import { IUserSettings } from '@store/settings/user-settings-state';
import { applyFontSize } from '@utils/apply-font-size';
import { applyTheme } from '@utils/apply-theme';

import { IGetUserSettingsSuccessActionPayload } from './action-payloads/get-user-settings-success-action-payload';

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

      yield apply(applyTheme, applyTheme, [action.payload?.theme]);
    };
  }
}
