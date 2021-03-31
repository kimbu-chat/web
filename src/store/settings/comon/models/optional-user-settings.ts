import { Langs, TypingStrategy, AllowedFontSize, Theme } from '../../features/models';

export interface IOptionalUserSettings {
  language?: Langs;
  theme?: Theme;
  typingStrategy?: TypingStrategy;
  notificationSound?: boolean;
  pushNotificationsEnabled?: boolean;
  fontSize?: AllowedFontSize;
}
