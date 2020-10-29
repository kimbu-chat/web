import produce from 'immer';
import { createReducer } from 'typesafe-actions';
import { SettingsActions } from './actions';
import { langs, typingStrategy, UserSettings } from './models';

const initialState: UserSettings = {
	language: navigator.language.includes('ru') ? langs.ru : langs.en,
	typingStrategy: typingStrategy.nlce,
	notificationSound: false,
};

const settings = createReducer<UserSettings>(initialState)
	.handleAction(
		SettingsActions.getUserSettingsSuccessAction,
		//@ts-ignore
		produce((draft: UserSettings, { payload }: ReturnType<typeof SettingsActions.getUserSettingsSuccessAction>) => {
			return { ...draft, ...payload };
		}),
	)
	.handleAction(
		SettingsActions.changeLanguageAction,
		produce((draft: UserSettings, { payload }: ReturnType<typeof SettingsActions.changeLanguageAction>) => {
			draft.language = payload.language;
			return draft;
		}),
	)
	.handleAction(
		SettingsActions.changeNotificationsSoundStateAction,
		produce((draft: UserSettings) => {
			draft.notificationSound = !draft.notificationSound;
			return draft;
		}),
	)
	.handleAction(
		SettingsActions.changeTypingStrategyAction,
		produce((draft: UserSettings, { payload }: ReturnType<typeof SettingsActions.changeTypingStrategyAction>) => {
			draft.typingStrategy = payload.strategy;
			return draft;
		}),
	);

export default settings;
