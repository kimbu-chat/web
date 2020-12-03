import { takeLatest } from 'redux-saga/effects';
import { AddFriend } from './features/add-friend';
import { DeleteFriend } from './features/delete-friend';
import { GetFriends } from './features/get-friends';

export const FriendSagas = [
  takeLatest(GetFriends.action, GetFriends.saga),
  takeLatest(DeleteFriend.action, DeleteFriend.saga),
  takeLatest(AddFriend.action, AddFriend.saga),
];
