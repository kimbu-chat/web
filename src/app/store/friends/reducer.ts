import { createReducer } from 'typesafe-actions';
import { IFriendsState } from './models';
import { AddFriendSuccess } from './features/add-friend/add-friend-success';
import { DeleteFriendSuccess } from './features/delete-friend/delete-friend-success';
import { GetFriends } from './features/get-friends/get-friends';
import { GetFriendsSuccess } from './features/get-friends/get-friends-success';
import { UserStatusChangedEvent } from './features/user-status-changed-event/user-status-changed-event';

const initialState: IFriendsState = {
  loading: true,
  friends: [],
  hasMoreFriends: true,
};

const friends = createReducer<IFriendsState>(initialState)
  .handleAction(DeleteFriendSuccess.action, DeleteFriendSuccess.reducer)
  .handleAction(UserStatusChangedEvent.action, UserStatusChangedEvent.reducer)
  .handleAction(AddFriendSuccess.action, AddFriendSuccess.reducer)
  .handleAction(GetFriends.action, GetFriends.reducer)
  .handleAction(GetFriendsSuccess.action, GetFriendsSuccess.reducer);

export default friends;
