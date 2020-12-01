import { ChangeLanguage } from './change-language';
import { ChangeNotificationSoundState } from './change-notification-sound-state';
import { ChangeTypingStrategy } from './change-typing-strategy';
import { GetUserSettings } from './get-user-settings';
import { GetUserSettingsSuccess } from './get-user-settings-success';

export namespace SettingsActions {
  export const changeLanguageAction = ChangeLanguage.action;
  export const changeNotificationSoundStateAction = ChangeNotificationSoundState.action;
  export const changeTypingStrategyAction = ChangeTypingStrategy.action;
  export const getUserSettingsSuccessAction = GetUserSettingsSuccess.action;
  export const getUserSettingsAction = GetUserSettings.action;
}
