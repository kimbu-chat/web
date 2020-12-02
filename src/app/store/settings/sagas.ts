import { takeLatest } from 'redux-saga/effects';
import { ChangeLanguage } from './change-language';
import { ChangeNotificationSoundState } from './change-notification-sound-state';
import { ChangeTypingStrategy } from './change-typing-strategy';
import { GetUserSettings } from './get-user-settings';

export const SettingsSagas = [
  takeLatest(ChangeLanguage.action, ChangeLanguage.saga),
  takeLatest(ChangeNotificationSoundState.action, ChangeNotificationSoundState.saga),
  takeLatest(ChangeTypingStrategy.action, ChangeTypingStrategy.saga),
  takeLatest(GetUserSettings.action, GetUserSettings.saga),
];
