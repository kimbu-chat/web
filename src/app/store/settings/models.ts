export enum langs {
	en = 'en',
	ru = 'ru',
}

export enum typingStrategy {
	nle = 'NewLineEnter',
	nlce = 'NewLineCtrlEnter',
}

export interface UserSettings {
	language: langs;
	typingStrategy: typingStrategy;
	notificationSound: boolean;
}

export interface OptionalUserSettings {
	language?: langs;
	typingStrategy?: typingStrategy;
	notificationSound?: boolean;
}

export interface ChangeLanguageReq {
	language: langs;
}

export interface ChangeTypingStrategyReq {
	strategy: typingStrategy;
}
