import { ChangeLanguage } from './features/change-language';
import { ChangeNotificationSoundState } from './features/change-notification-sound-state';
import { ChangeTypingStrategy } from './features/change-typing-strategy';
import { GetUserSettings } from './features/get-user-settings';
import { GetUserSettingsSuccess } from './features/get-user-settings-success';

export namespace SettingsActions {
  export const changeLanguageAction = ChangeLanguage.action;
  export const changeNotificationSoundStateAction = ChangeNotificationSoundState.action;
  export const changeTypingStrategyAction = ChangeTypingStrategy.action;
  export const getUserSettingsSuccessAction = GetUserSettingsSuccess.action;
  export const getUserSettingsAction = GetUserSettings.action;
}
