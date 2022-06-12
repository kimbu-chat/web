import { BlockUser } from './features/block-user/block-user';
import { ChangeFontSize } from './features/change-font-size/change-font-size';
import { ChangeLanguage } from './features/change-language/change-language';
import { ChangeNotificationSoundState } from './features/change-notification-sound-state/change-notification-sound-state';
import { ChangePushNotificationState } from './features/change-push-notification-state/change-push-notification-state';
import { ChangeTheme } from './features/change-theme/change-theme';
import { ChangeTypingStrategy } from './features/change-typing-strategy/change-typing-strategy';
import { GetBlackList } from './features/get-black-list/get-black-list';
import { GetSessionList } from './features/get-sesion-list/get-sesion-list';
import { GetUserSettings } from './features/get-user-settings/get-user-settings';
import { TerminateSession } from './features/terminate-session/terminate-session';
import { UnblockUser } from './features/unblock-user/unblock-user';

// SettingsActions
export const changeLanguageAction = ChangeLanguage.action;
export const changeNotificationSoundStateAction = ChangeNotificationSoundState.action;
export const changeTypingStrategyAction = ChangeTypingStrategy.action;
export const getUserSettingsAction = GetUserSettings.action;
export const changeThemeAction = ChangeTheme.action;
export const changeFontSizeAction = ChangeFontSize.action;
export const changePushNotificationStateAction = ChangePushNotificationState.action;
export const getBlackListAction = GetBlackList.action;
export const blockUserAction = BlockUser.action;
export const unblockUserAction = UnblockUser.action;
export const getSessionListAction = GetSessionList.action;
export const terminateSessionAction = TerminateSession.action;
