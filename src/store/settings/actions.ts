import { TerminateSessionSuccess } from '@store/settings/features/terminate-session/terminate-session-success';

import { BlockUserSuccess } from './features/block-user/block-user-success';
import { BlockUser } from './features/block-user/block-user';
import { ChangeFontSize } from './features/change-font-size/change-font-size';
import { ChangeLanguage } from './features/change-language/change-language';
import { ChangeNotificationSoundState } from './features/change-notification-sound-state/change-notification-sound-state';
import { ChangePushNotificationStateSuccess } from './features/change-push-notification-state/change-push-notification-state-success';
import { ChangePushNotificationState } from './features/change-push-notification-state/change-push-notification-state';
import { ChangeTheme } from './features/change-theme/change-theme';
import { ChangeTypingStrategy } from './features/change-typing-strategy/change-typing-strategy';
import { GetBlackListSuccess } from './features/get-black-list/get-black-list-success';
import { GetBlackList } from './features/get-black-list/get-black-list';
import { GetSessionListSuccess } from './features/get-sesion-list/get-sesion-list-success';
import { GetSessionList } from './features/get-sesion-list/get-sesion-list';
import { GetUserSettingsSuccess } from './features/get-user-settings/get-user-settings-success';
import { GetUserSettings } from './features/get-user-settings/get-user-settings';
import { TerminateSession } from './features/terminate-session/terminate-session';
import { UnblockUserSuccess } from './features/unblock-user/unblock-user-success';
import { UnblockUser } from './features/unblock-user/unblock-user';
import { UserAddedToBlackListEventHandler } from './socket-events/user-added-to-black-list/user-added-to-black-list-event-handler';
import { UserRemovedFromBlackListEventHandler } from './socket-events/user-removed-from-black-list/user-removed-from-black-list-event-handler';

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
export const terminateSessionAction = TerminateSession.action;
export const terminateSessionSuccessAction = TerminateSessionSuccess.action;
export const userRemovedFromBlackListEventHandler = UserRemovedFromBlackListEventHandler.action;
export const userAddedToBlackListEventHandler = UserAddedToBlackListEventHandler.action;

export type SettingsActions =
  // SettingsActions
  typeof changeLanguageAction &
  typeof changeNotificationSoundStateAction &
  typeof changeTypingStrategyAction &
  typeof getUserSettingsSuccessAction &
  typeof getUserSettingsAction &
  typeof changeThemeAction &
  typeof changeFontSizeAction &
  typeof changePushNotificationStateAction &
  typeof changePushNotificationStateSuccessAction &
  typeof getBlackListSuccessAction &
  typeof getBlackListAction &
  typeof blockUserAction &
  typeof blockUserSuccessAction &
  typeof unblockUserAction &
  typeof unblockUserSuccessAction &
  typeof getSessionListAction &
  typeof getSessionListSucessAction &
  typeof terminateSessionAction &
  typeof terminateSessionSuccessAction &
  typeof userRemovedFromBlackListEventHandler &
  typeof userAddedToBlackListEventHandler;
