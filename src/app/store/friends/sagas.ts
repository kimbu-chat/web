import { FriendActions } from './actions';
import { call, put, takeLatest } from 'redux-saga/effects';
import { HTTPStatusCode } from 'app/common/http-status-code';
import { SagaIterator } from 'redux-saga';
import { FriendsHttpRequests } from './http-requests';

function* getFriendsSaga(action: ReturnType<typeof FriendActions.getFriends>): SagaIterator {
	const { name, initializedBySearch } = action.payload;
	const request = FriendsHttpRequests.getFriends;
	const { data } = request.call(yield call(() => request.generator(action.payload)));

	yield put(
		FriendActions.getFriendsSuccess({
			users: data,
			name,
			initializedBySearch,
		}),
	);
}

export function* deleteFriendSaga(action: ReturnType<typeof FriendActions.deleteFriend>): SagaIterator {
	const userId = action.payload;
	try {
		const httpRequest = FriendsHttpRequests.deleteFriend;
		const { status } = httpRequest.call(yield call(() => httpRequest.generator(action.payload)));

		if (status === HTTPStatusCode.OK) {
			yield put(FriendActions.deleteFriendSuccess(userId));
		} else {
			alert('Failed to delete contact');
		}
	} catch {
		alert('Failed to delete contact');
	}
}

export const FriendSagas = [
	takeLatest(FriendActions.getFriends, getFriendsSaga),
	takeLatest(FriendActions.deleteFriend, deleteFriendSaga),
];
