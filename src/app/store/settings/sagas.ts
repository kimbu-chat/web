import { takeLatest } from 'redux-saga/effects';
import { ChangeLanguage } from './features/change-language';
import { ChangeNotificationSoundState } from './features/change-notification-sound-state';
import { ChangeTypingStrategy } from './features/change-typing-strategy';
import { GetUserSettings } from './features/get-user-settings';

export const SettingsSagas = [
  takeLatest(ChangeLanguage.action, ChangeLanguage.saga),
  takeLatest(ChangeNotificationSoundState.action, ChangeNotificationSoundState.saga),
  takeLatest(ChangeTypingStrategy.action, ChangeTypingStrategy.saga),
  takeLatest(GetUserSettings.action, GetUserSettings.saga),
];
