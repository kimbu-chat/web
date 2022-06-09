import { createReducer } from '@reduxjs/toolkit';

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

const reducer = createReducer<IUserSettings>(initialState, (builder) =>
  builder
    .addCase(ChangeNotificationSoundState.action, ChangeNotificationSoundState.reducer)
    .addCase(ChangeTypingStrategy.action, ChangeTypingStrategy.reducer)
    .addCase(ChangeLanguage.action, ChangeLanguage.reducer)
    .addCase(ChangeTheme.action, ChangeTheme.reducer)
    .addCase(GetUserSettingsSuccess.action, GetUserSettingsSuccess.reducer)
    .addCase(ChangeFontSize.action, ChangeFontSize.reducer)
    .addCase(ChangePushNotificationStateSuccess.action, ChangePushNotificationStateSuccess.reducer)
    .addCase(GetBlackListSuccess.action, GetBlackListSuccess.reducer)
    .addCase(GetBlackList.action, GetBlackList.reducer)
    .addCase(GetSessionList.action, GetSessionList.reducer)
    .addCase(UnblockUserSuccess.action, UnblockUserSuccess.reducer)
    .addCase(GetSessionListSuccess.action, GetSessionListSuccess.reducer)
    .addCase(TerminateSessionSuccess.action, TerminateSessionSuccess.reducer),
);

export default reducer;
