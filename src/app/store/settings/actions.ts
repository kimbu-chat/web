import { ChangeLanguage } from './features/change-language/change-language';
import { ChangeNotificationSoundState } from './features/change-notification-sound-state/change-notification-sound-state';
import { ChangeTypingStrategy } from './features/change-typing-strategy/change-typing-strategy';
import { GetUserSettings } from './features/get-user-settings/get-user-settings';
import { GetUserSettingsSuccess } from './features/get-user-settings/get-user-settings-success';

// SettingsActions
export const changeLanguageAction = ChangeLanguage.action;
export const changeNotificationSoundStateAction = ChangeNotificationSoundState.action;
export const changeTypingStrategyAction = ChangeTypingStrategy.action;
export const getUserSettingsSuccessAction = GetUserSettingsSuccess.action;
export const getUserSettingsAction = GetUserSettings.action;
