export enum Langs {
  En = 'en',
  Ru = 'ru',
}

export enum TypingStrategy {
  Nle = 'NewLineEnter',
  Nlce = 'NewLineCtrlEnter',
}

export interface IUserSettings {
  language: Langs;
  typingStrategy: TypingStrategy;
  notificationSound: boolean;
}
