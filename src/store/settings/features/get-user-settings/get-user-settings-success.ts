import { createAction } from 'typesafe-actions';
import produce from 'immer';

import { IUserSettings } from '@store/settings/user-settings-state';
import { SagaIterator } from 'redux-saga';
import { IGetUserSettingsSuccessActionPayload } from './action-payloads/get-user-settings-success-action-payload';

export class GetUserSettingsSuccess {
  static get action() {
    return createAction('GET_USER_SETTINGS_SUCCESS')<IGetUserSettingsSuccessActionPayload | undefined>();
  }

  static get reducer() {
    return produce((draft: IUserSettings, { payload }: ReturnType<typeof GetUserSettingsSuccess.action>) => ({
      ...draft,
      ...payload,
    }));
  }

  static get saga() {
    return function* getUserSettingsSuccesSaga(action: ReturnType<typeof GetUserSettingsSuccess.action>): SagaIterator {
      const element = document.querySelector('#message-font-size') || document.createElement('style');
      element.id = 'message-font-size';
      element.innerHTML = `.message__content span{ font-size: ${action.payload?.fontSize || 16}px !important; }`;
      document.head.appendChild(element);
    };
  }
}
