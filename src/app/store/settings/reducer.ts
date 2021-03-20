import { createReducer } from 'typesafe-actions';

import { ChangeLanguage } from './features/change-language/change-language';
import { ChangeNotificationSoundState } from './features/change-notification-sound-state/change-notification-sound-state';
import { ChangeTypingStrategy } from './features/change-typing-strategy/change-typing-strategy';
import { GetUserSettingsSuccess } from './features/get-user-settings/get-user-settings-success';
import { Langs, TypingStrategy } from './features/models';
import { IUserSettings } from './user-settings-state';

const initialState: IUserSettings = {
  language: navigator.language.includes('ru') ? Langs.Ru : Langs.En,
  typingStrategy: TypingStrategy.Nlce,
  notificationSound: true,
};

const settings = createReducer<IUserSettings>(initialState)
  .handleAction(ChangeNotificationSoundState.action, ChangeNotificationSoundState.reducer)
  .handleAction(ChangeTypingStrategy.action, ChangeTypingStrategy.reducer)
  .handleAction(ChangeLanguage.action, ChangeLanguage.reducer)
  .handleAction(GetUserSettingsSuccess.action, GetUserSettingsSuccess.reducer);

export default settings;
