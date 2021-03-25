import { createReducer } from 'typesafe-actions';
import { UserEditedEventHandler } from './socket-events/user-edited/user-edited-event-handler';
import { AddFriendSuccess } from './features/add-friend/add-friend-success';
import { DeleteFriendSuccess } from './features/delete-friend/delete-friend-success';
import { GetFriends } from './features/get-friends/get-friends';
import { GetFriendsSuccess } from './features/get-friends/get-friends-success';
import { UserStatusChangedEventHandler } from './socket-events/user-status-changed/user-status-changed-event-handler';
import { UserContactsRemovedEventHandler } from './socket-events/user-contacts-removed/user-contacts-removed-event-handler';
import { IFriendsState } from './friends-state';

const initialState: IFriendsState = {
  loading: false,
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
  .handleAction(UserContactsRemovedEventHandler.action, UserContactsRemovedEventHandler.reducer)
  .handleAction(UserEditedEventHandler.action, UserEditedEventHandler.reducer);

export default friends;
