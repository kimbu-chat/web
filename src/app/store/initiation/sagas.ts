import { AuthService } from 'app/services/auth-service';
import { put, fork } from 'redux-saga/effects';
import { MyProfileActions } from '../my-profile/actions';
import { FriendActions } from '../friends/actions';
import { SagaIterator } from 'redux-saga';
import { WebSocketActions } from '../sockets/actions';
import { intervalInternetConnectionCheckSaga } from '../internet/sagas';

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

	yield fork(intervalInternetConnectionCheckSaga);
}

export const InitiationSagas = [fork(initializeSaga)];
