import { Theme, AllowedFontSize, Langs } from './features/models';
import { TypingStrategy } from './features/models/typing-strategy';

export interface IUserSettings {
  language: Langs;
  theme: Theme;
  typingStrategy: TypingStrategy;
  fontSize: AllowedFontSize;
  notificationSound: boolean;
  pushNotificationsEnabled: boolean;
}
