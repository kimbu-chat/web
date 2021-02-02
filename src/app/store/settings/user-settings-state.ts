import { Langs } from './features/models/langs';
import { TypingStrategy } from './features/models/typing-strategy';

export interface IUserSettings {
  language: Langs;
  typingStrategy: TypingStrategy;
  notificationSound: boolean;
}
