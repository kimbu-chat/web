import { BlockUser } from './features/block-user/block-user';
import { BlockUserSuccess } from './features/block-user/block-user-success';
import { ChangeFontSize } from './features/change-font-size/change-font-size';
import { ChangeLanguage } from './features/change-language/change-language';
import { ChangeNotificationSoundState } from './features/change-notification-sound-state/change-notification-sound-state';
import { ChangePushNotificationState } from './features/change-push-notification-state/change-push-notification-state';
import { ChangePushNotificationStateSuccess } from './features/change-push-notification-state/change-push-notification-state-success';
import { ChangeTheme } from './features/change-theme/change-theme';
import { ChangeTypingStrategy } from './features/change-typing-strategy/change-typing-strategy';
import { GetBlackList } from './features/get-black-list/get-black-list';
import { GetBlackListSuccess } from './features/get-black-list/get-black-list-success';
import { GetSessionList } from './features/get-sesion-list/get-sesion-list';
import { GetSessionListSuccess } from './features/get-sesion-list/get-sesion-list-success';
import { GetUserSettings } from './features/get-user-settings/get-user-settings';
import { GetUserSettingsSuccess } from './features/get-user-settings/get-user-settings-success';
import { RevokeSession } from './features/revoke-session/revoke-session';
import { RevokeSessionSuccess } from './features/revoke-session/revoke-session-success';
import { UnblockUser } from './features/unblock-user/unblock-user';
import { UnblockUserSuccess } from './features/unblock-user/unblock-user-success';

// SettingsActions
export const changeLanguageAction = ChangeLanguage.action;
export const changeNotificationSoundStateAction = ChangeNotificationSoundState.action;
export const changeTypingStrategyAction = ChangeTypingStrategy.action;
export const getUserSettingsSuccessAction = GetUserSettingsSuccess.action;
export const getUserSettingsAction = GetUserSettings.action;
export const changeThemeAction = ChangeTheme.action;
export const changeFontSizeAction = ChangeFontSize.action;
export const changePushNotificationStateAction = ChangePushNotificationState.action;
export const changePushNotificationStateSuccessAction = ChangePushNotificationStateSuccess.action;
export const getBlackListSuccessAction = GetBlackListSuccess.action;
export const getBlackListAction = GetBlackList.action;
export const blockUserAction = BlockUser.action;
export const blockUserSuccessAction = BlockUserSuccess.action;
export const unblockUserAction = UnblockUser.action;
export const unblockUserSuccessAction = UnblockUserSuccess.action;
export const getSessionListAction = GetSessionList.action;
export const getSessionListSucessAction = GetSessionListSuccess.action;
export const revokeSessionAction = RevokeSession.action;
export const revokeSessionSuccessAction = RevokeSessionSuccess.action;

export const SettingsActions = {
  // SettingsActions
  changeLanguageAction,
  changeNotificationSoundStateAction,
  changeTypingStrategyAction,
  getUserSettingsSuccessAction,
  getUserSettingsAction,
  changeThemeAction,
  changeFontSizeAction,
  changePushNotificationStateAction,
  changePushNotificationStateSuccessAction,
  getBlackListSuccessAction,
  getBlackListAction,
  blockUserAction,
  blockUserSuccessAction,
  unblockUserAction,
  unblockUserSuccessAction,
  getSessionListAction,
  getSessionListSucessAction,
  revokeSessionAction,
  revokeSessionSuccessAction,
};
