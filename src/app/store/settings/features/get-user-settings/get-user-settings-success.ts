import { createAction } from 'typesafe-actions';
import produce from 'immer';
import { IGetUserSettingsSuccessActionPayload } from './action-payloads/get-user-settings-success-action-payload';
import { IUserSettings } from '../../user-settings-state';

export class GetUserSettingsSuccess {
  static get action() {
    return createAction('GET_USER_SETTINGS_SUCCESS')<IGetUserSettingsSuccessActionPayload>();
  }

  static get reducer() {
    return produce((draft: IUserSettings, { payload }: ReturnType<typeof GetUserSettingsSuccess.action>) => ({
      ...draft,
      ...payload,
    }));
  }
}
