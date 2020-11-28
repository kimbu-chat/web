import { createAction } from 'typesafe-actions';
import { createEmptyAction } from '../common/actions';
import { UserSettings, ChangeLanguageReq, ChangeTypingStrategyReq } from './models';

export namespace SettingsActions {
  export const getUserSettingsAction = createEmptyAction('GET_USER_SETTINGS');
  export const getUserSettingsSuccessAction = createAction('GET_USER_SETTINGS_SUCCESS')<UserSettings>();
  export const changeLanguageAction = createAction('CHANGE_LANGUAGE')<ChangeLanguageReq>();
  export const changeNotificationsSoundStateAction = createEmptyAction('CHANGE_NOTIFICATIONS_SOUND_STATE');
  export const changeTypingStrategyAction = createAction('CHANGE_TYPING_STRATEGY')<ChangeTypingStrategyReq>();
}
