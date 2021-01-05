import { Langs } from './langs';
import { TypingStrategy } from './typing-strategy';

export interface IUserSettings {
  language: Langs;
  typingStrategy: TypingStrategy;
  notificationSound: boolean;
}
