import { createReducer } from 'typesafe-actions';
import { IFriendsState } from './models';
import { AddFriendSuccess } from './features/add-friend/add-friend-success';
import { DeleteFriendSuccess } from './features/delete-friend/delete-friend-success';
import { GetFriends } from './features/get-friends/get-friends';
import { GetFriendsSuccess } from './features/get-friends/get-friends-success';
import { UserStatusChangedEventHandler } from './socket-events/user-status-changed/user-status-changed-event-handler';
import { UserContactsRemovedEventHandler } from './socket-events/user-contacts-removed/user-contacts-removed-event-handler';

const initialState: IFriendsState = {
  loading: true,
  friends: [],
  hasMoreFriends: true,
};

const friends = createReducer<IFriendsState>(initialState)
  .handleAction(DeleteFriendSuccess.action, DeleteFriendSuccess.reducer)
  .handleAction(AddFriendSuccess.action, AddFriendSuccess.reducer)
  .handleAction(GetFriends.action, GetFriends.reducer)
  .handleAction(GetFriendsSuccess.action, GetFriendsSuccess.reducer)

  // socket-events
  .handleAction(UserStatusChangedEventHandler.action, UserStatusChangedEventHandler.reducer)
  .handleAction(UserContactsRemovedEventHandler.action, UserContactsRemovedEventHandler.reducer);

export default friends;
