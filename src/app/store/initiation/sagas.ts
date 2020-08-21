import { AuthService } from 'app/services/auth-service';
import { put, fork, spawn, take, select } from 'redux-saga/effects';
import { MyProfileActions } from '../my-profile/actions';
import { FriendActions } from '../friends/actions';
import { SagaIterator, eventChannel } from 'redux-saga';
import { WebSocketActions } from '../sockets/actions';
import { intervalInternetConnectionCheckSaga } from '../internet/sagas';
import { RootState } from '../root-reducer';

export function* initializeSaga(): SagaIterator {
	const authService = new AuthService();
	const authData = authService.securityTokens;

	if (!authData) {
		return;
	}

	yield put(WebSocketActions.initSocketConnection());
	yield put(MyProfileActions.changeUserOnlineStatus(true));

	yield put(MyProfileActions.getMyProfile());

	yield put(
		FriendActions.getFriends({
			page: { offset: 0, limit: 100 },
			initializedBySearch: false,
		}),
	);

	yield spawn(intervalInternetConnectionCheckSaga);
	yield spawn(watcher);
}

function createVisibilityChannel() {
	return eventChannel((emit) => {
		const change = () => {
			emit(!document.hidden);
		};
		const onBlur = () => emit(false);
		const onFocus = () => emit(true);

		document.addEventListener('visibilitychange', change);
		window.addEventListener('blur', onBlur);
		window.addEventListener('focus', onFocus);

		return () => {
			document.removeEventListener('visibilitychange', change);
			window.removeEventListener('blur', onBlur);
			window.removeEventListener('focus', onFocus);
		};
	});
}

function* watcher() {
	const channel = createVisibilityChannel();
	const amIauthenticated = yield select((state: RootState) => state.auth.isAuthenticated);
	while (true) {
		const action =
			(yield take(channel)) && amIauthenticated
				? MyProfileActions.changeUserOnlineStatus(true)
				: MyProfileActions.changeUserOnlineStatus(false);
		yield put(action);
	}
}

export const InitiationSagas = [fork(initializeSaga)];
