import { createReducer } from 'typesafe-actions';

import { ChangeFontSize } from './features/change-font-size/change-font-size';
import { ChangeLanguage } from './features/change-language/change-language';
import { ChangeNotificationSoundState } from './features/change-notification-sound-state/change-notification-sound-state';
import { ChangePushNotificationStateSuccess } from './features/change-push-notification-state/change-push-notification-state-success';
import { ChangeTheme } from './features/change-theme/change-theme';
import { ChangeTypingStrategy } from './features/change-typing-strategy/change-typing-strategy';
import { GetBlackListSuccess } from './features/get-black-list/get-black-list-success';
import { GetBlackList } from './features/get-black-list/get-black-list';
import { GetSessionListSuccess } from './features/get-sesion-list/get-sesion-list-success';
import { GetSessionList } from './features/get-sesion-list/get-sesion-list';
import { GetUserSettingsSuccess } from './features/get-user-settings/get-user-settings-success';
import { Langs, Theme, TypingStrategy } from './features/models';
import { TerminateSessionSuccess } from './features/terminate-session/terminate-session-success';
import { UnblockUserSuccess } from './features/unblock-user/unblock-user-success';
import { IUserSettings } from './user-settings-state';

const initialState: IUserSettings = {
  language: navigator.language.includes('ru') ? Langs.Ru : Langs.En,
  typingStrategy: TypingStrategy.Nlce,
  notificationSound: true,
  theme: Theme.DARK,
  fontSize: 16,
  pushNotificationsEnabled: true,
  blackList: {
    isLoading: false,
    users: [],
  },
  sessionList: {
    isLoading: false,
    sessions: [],
  },
};

const reducer = createReducer<IUserSettings>(initialState)
  .handleAction(ChangeNotificationSoundState.action, ChangeNotificationSoundState.reducer)
  .handleAction(ChangeTypingStrategy.action, ChangeTypingStrategy.reducer)
  .handleAction(ChangeLanguage.action, ChangeLanguage.reducer)
  .handleAction(ChangeTheme.action, ChangeTheme.reducer)
  .handleAction(GetUserSettingsSuccess.action, GetUserSettingsSuccess.reducer)
  .handleAction(ChangeFontSize.action, ChangeFontSize.reducer)
  .handleAction(
    ChangePushNotificationStateSuccess.action,
    ChangePushNotificationStateSuccess.reducer,
  )
  .handleAction(GetBlackListSuccess.action, GetBlackListSuccess.reducer)
  .handleAction(GetBlackList.action, GetBlackList.reducer)
  .handleAction(GetSessionList.action, GetSessionList.reducer)
  .handleAction(UnblockUserSuccess.action, UnblockUserSuccess.reducer)
  .handleAction(GetSessionListSuccess.action, GetSessionListSuccess.reducer)
  .handleAction(TerminateSessionSuccess.action, TerminateSessionSuccess.reducer);

export default reducer;
