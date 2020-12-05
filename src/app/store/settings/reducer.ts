import { createReducer } from 'typesafe-actions';
import { ChangeLanguage } from './features/change-language/change-language';
import { ChangeNotificationSoundState } from './features/change-notification-sound-state/change-notification-sound-state';
import { ChangeTypingStrategy } from './features/change-typing-strategy/change-typing-strategy';
import { GetUserSettingsSuccess } from './features/get-user-settings/get-user-settings-success';
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
