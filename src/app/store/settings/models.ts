export enum Langs {
  en = 'en',
  ru = 'ru',
}

export enum TypingStrategy {
  nle = 'NewLineEnter',
  nlce = 'NewLineCtrlEnter',
}

export interface UserSettings {
  language: Langs;
  TypingStrategy: TypingStrategy;
  notificationSound: boolean;
}

export interface OptionalUserSettings {
  language?: Langs;
  TypingStrategy?: TypingStrategy;
  notificationSound?: boolean;
}
