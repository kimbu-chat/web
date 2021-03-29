import { takeLatest } from 'redux-saga/effects';
import { ChangeFontSize } from './features/change-font-size/change-font-size';

import { ChangeLanguage } from './features/change-language/change-language';
import { ChangeNotificationSoundState } from './features/change-notification-sound-state/change-notification-sound-state';
import { ChangePushNotificationState } from './features/change-push-notification-state/change-push-notification-state';
import { ChangeTheme } from './features/change-theme/change-theme';
import { ChangeTypingStrategy } from './features/change-typing-strategy/change-typing-strategy';
import { GetUserSettings } from './features/get-user-settings/get-user-settings';
import { GetUserSettingsSuccess } from './features/get-user-settings/get-user-settings-success';

export const SettingsSagas = [
  takeLatest(ChangeLanguage.action, ChangeLanguage.saga),
  takeLatest(ChangeNotificationSoundState.action, ChangeNotificationSoundState.saga),
  takeLatest(ChangeTypingStrategy.action, ChangeTypingStrategy.saga),
  takeLatest(GetUserSettings.action, GetUserSettings.saga),
  takeLatest(GetUserSettingsSuccess.action, GetUserSettingsSuccess.saga),
  takeLatest(ChangeTheme.action, ChangeTheme.saga),
  takeLatest(ChangeFontSize.action, ChangeFontSize.saga),
  takeLatest(ChangePushNotificationState.action, ChangePushNotificationState.saga),
];
