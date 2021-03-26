import { createAction } from 'typesafe-actions';
import produce from 'immer';

import { IUserSettings } from '@store/settings/user-settings-state';
import { SagaIterator } from 'redux-saga';
import { IGetUserSettingsSuccessActionPayload } from './action-payloads/get-user-settings-success-action-payload';
import { apply } from '@redux-saga/core/effects';
import { applyFontSize } from '@utils/apply-font-size';

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
    };
  }
}
