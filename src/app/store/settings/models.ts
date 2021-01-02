export enum Langs {
  en = 'en',
  ru = 'ru',
}

export enum TypingStrategy {
  nle = 'NewLineEnter',
  nlce = 'NewLineCtrlEnter',
}

export interface IUserSettings {
  language: Langs;
  typingStrategy: TypingStrategy;
  notificationSound: boolean;
}

export interface IOptionalUserSettings {
  language?: Langs;
  typingStrategy?: TypingStrategy;
  notificationSound?: boolean;
}
