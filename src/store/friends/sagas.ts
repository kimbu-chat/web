import { takeEvery, takeLatest } from 'redux-saga/effects';
import { AddFriend } from './features/add-friend/add-friend';
import { DeleteFriend } from './features/delete-friend/delete-friend';
import { DismissToAddContact } from './features/dismiss-to-add-contact/dismiss-to-add-contact';
import { GetFriends } from './features/get-friends/get-friends';
import { GetUserByPhone } from './features/get-user-by-phone/get-user-by-phone';
import { UserStatusChangedEventHandler } from './socket-events/user-status-changed/user-status-changed-event-handler';

export const FriendSagas = [
  takeLatest(GetFriends.action, GetFriends.saga),
  takeLatest(DeleteFriend.action, DeleteFriend.saga),
  takeEvery(AddFriend.action, AddFriend.saga),
  takeEvery(GetUserByPhone.action, GetUserByPhone.saga),
  takeEvery(DismissToAddContact.action, DismissToAddContact.saga),
  takeEvery(UserStatusChangedEventHandler.action, UserStatusChangedEventHandler.saga),
];
