import { call, put, takeLatest } from 'redux-saga/effects';
import { HTTPStatusCode } from 'app/common/http-status-code';
import { SagaIterator } from 'redux-saga';
import { FriendActions } from './actions';
import { FriendsHttpRequests } from './http-requests';
import { UpdateFriendListActionData } from './models';

function* getFriendsSaga(action: ReturnType<typeof FriendActions.getFriends>): SagaIterator {
  const { name, initializedBySearch, page } = action.payload;
  const request = FriendsHttpRequests.getFriends;
  const { data } = request.call(yield call(() => request.generator(action.payload)));

  const hasMore = data.length >= page.limit;

  yield put(
    FriendActions.getFriendsSuccess({
      users: data,
      name,
      initializedBySearch,
      hasMore,
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

export function* addFriendSaga(action: ReturnType<typeof FriendActions.addFriend>): SagaIterator {
  const user = action.payload;
  try {
    const phoneToAdd: UpdateFriendListActionData = { phoneNumbers: [user.phoneNumber] };
    const httpRequest = FriendsHttpRequests.updateFriendList;
    const { status } = httpRequest.call(yield call(() => httpRequest.generator(phoneToAdd)));

    if (status === HTTPStatusCode.OK) {
      yield put(FriendActions.addFriendSuccess(user));
    } else {
      alert('Failed to add contact');
    }
  } catch {
    alert('Failed to add contact');
  }
}

export const FriendSagas = [
  takeLatest(FriendActions.getFriends, getFriendsSaga),
  takeLatest(FriendActions.deleteFriend, deleteFriendSaga),
  takeLatest(FriendActions.addFriend, addFriendSaga),
];
