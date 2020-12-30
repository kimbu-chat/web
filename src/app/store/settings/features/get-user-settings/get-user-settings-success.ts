import { createAction } from 'typesafe-actions';
import produce from 'immer';
import { IUserSettings } from '../../models';
import { IGetUserSettingsSuccessActionPayload } from './get-user-settings-success-action-payload';

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
