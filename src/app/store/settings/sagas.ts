import { SettingsService } from 'app/services/settings-service';
import { SagaIterator } from 'redux-saga';
import { put, select, takeLatest } from 'redux-saga/effects';
import { SettingsActions } from './actions';
import { areNotificationsEnabled } from './selectors';

export function* getUserSettings(): SagaIterator {
	const savedSettings = new SettingsService().settings;
	yield put(SettingsActions.getUserSettingsSuccessAction(savedSettings));
}

export function* changeUserLanguageSaga(action: ReturnType<typeof SettingsActions.changeLanguageAction>): SagaIterator {
	new SettingsService().initializeOrUpdate({ language: action.payload.language });
}

export function* changeTypingStrategySaga(
	action: ReturnType<typeof SettingsActions.changeTypingStrategyAction>,
): SagaIterator {
	new SettingsService().initializeOrUpdate({ typingStrategy: action.payload.strategy });
}

export function* changeSoundNotificationsStateSaga(): SagaIterator {
	const state = yield select(areNotificationsEnabled);
	console.log(state);
	new SettingsService().initializeOrUpdate({ notificationSound: state });
}

export const SettingsSagas = [
	takeLatest(SettingsActions.getUserSettingsAction, getUserSettings),
	takeLatest(SettingsActions.changeLanguageAction, changeUserLanguageSaga),
	takeLatest(SettingsActions.changeTypingStrategyAction, changeTypingStrategySaga),
	takeLatest(SettingsActions.changeNotificationsSoundStateAction, changeSoundNotificationsStateSaga),
];
