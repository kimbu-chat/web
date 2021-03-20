import { createAction } from 'typesafe-actions';
import produce from 'immer';

import { IUserSettings } from '@store/settings/user-settings-state';

export class GetUserSettingsSuccess {
  static get action() {
    return createAction('GET_USER_SETTINGS_SUCCESS')<IUserSettings>();
  }

  static get reducer() {
    return produce((draft: IUserSettings, { payload }: ReturnType<typeof GetUserSettingsSuccess.action>) => ({
      ...draft,
      ...payload,
    }));
  }
}
