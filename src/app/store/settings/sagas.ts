import { takeLatest } from 'redux-saga/effects';
import { ChangeFontSize } from './features/change-font-size/change-font-size';

import { ChangeLanguage } from './features/change-language/change-language';
import { ChangeNotificationSoundState } from './features/change-notification-sound-state/change-notification-sound-state';
import { ChangeTheme } from './features/change-theme/change-theme';
import { ChangeTypingStrategy } from './features/change-typing-strategy/change-typing-strategy';
import { GetUserSettings } from './features/get-user-settings/get-user-settings';

export const SettingsSagas = [
  takeLatest(ChangeLanguage.action, ChangeLanguage.saga),
  takeLatest(ChangeNotificationSoundState.action, ChangeNotificationSoundState.saga),
  takeLatest(ChangeTypingStrategy.action, ChangeTypingStrategy.saga),
  takeLatest(GetUserSettings.action, GetUserSettings.saga),
  takeLatest(ChangeTheme.action, ChangeTheme.saga),
  takeLatest(ChangeFontSize.action, ChangeFontSize.saga),
];
