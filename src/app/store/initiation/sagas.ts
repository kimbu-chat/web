import { AuthService } from 'app/services/auth-service';
import { put, fork } from 'redux-saga/effects';
import { initSocketConnectionAction } from '../sockets/actions';
import { MyProfileActions } from '../my-profile/actions';
import { FriendActions } from '../friends/actions';
import { SagaIterator } from 'redux-saga';

function* initializeSaga(): SagaIterator {
	const authService = new AuthService();
	const authData = authService.securityTokens;

	if (!authData) {
		return;
	}

	yield put(initSocketConnectionAction());
	yield put(MyProfileActions.changeUserOnlineStatus(true));

	yield put(MyProfileActions.getMyProfile());

	yield put(
		FriendActions.getFriends({
			page: { offset: 0, limit: 100 },
			initializedBySearch: false,
		}),
	);
}

export const InitiationSagas = [fork(initializeSaga)];
