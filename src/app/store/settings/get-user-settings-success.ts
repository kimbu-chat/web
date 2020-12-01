import { createAction } from 'typesafe-actions';
import produce from 'immer';
import { UserSettings } from './models';

export class GetUserSettingsSuccess {
  static get action() {
    return createAction('GET_USER_SETTINGS_SUCCESS')<UserSettings>();
  }

  static get reducer() {
    return produce(function (draft: UserSettings, { payload }: ReturnType<typeof GetUserSettingsSuccess.action>) {
      return {
        ...draft,
        ...payload,
      };
    });
  }
}
