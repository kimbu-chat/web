import { createReducer } from 'typesafe-actions';
import { ChangeLanguage } from './change-language';
import { ChangeNotificationSoundState } from './change-notification-sound-state';
import { ChangeTypingStrategy } from './change-typing-strategy';
import { GetUserSettingsSuccess } from './get-user-settings-success';
import { Langs, TypingStrategy, UserSettings } from './models';

const initialState: UserSettings = {
  language: navigator.language.includes('ru') ? Langs.ru : Langs.en,
  TypingStrategy: TypingStrategy.nlce,
  notificationSound: false,
};

const settings = createReducer<UserSettings>(initialState)
  .handleAction(ChangeNotificationSoundState.action, ChangeNotificationSoundState.reducer)
  .handleAction(ChangeTypingStrategy.action, ChangeTypingStrategy.reducer)
  .handleAction(ChangeLanguage.action, ChangeLanguage.reducer)
  .handleAction(GetUserSettingsSuccess.action, GetUserSettingsSuccess.reducer);

export default settings;
