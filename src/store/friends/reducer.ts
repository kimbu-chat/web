import { createReducer } from 'typesafe-actions';

import { AddFriendSuccess } from './features/add-friend/add-friend-success';
import { DeleteFriendSuccess } from './features/delete-friend/delete-friend-success';
import { GetFriendsSuccess } from './features/get-friends/get-friends-success';
import { GetFriends } from './features/get-friends/get-friends';
import { ResetSearchFriends } from './features/reset-search-friends/reset-search-friends';
import { IFriendsState } from './friends-state';
import { UserContactsRemovedEventHandler } from './socket-events/user-contacts-removed/user-contacts-removed-event-handler';

const initialState: IFriendsState = {
  friends: {
    friendIds: [],
    hasMore: true,
    loading: false,
  },
  searchFriends: {
    friendIds: [],
    hasMore: true,
    loading: false,
  },
};

const reducer = createReducer<IFriendsState>(initialState)
  .handleAction(DeleteFriendSuccess.action, DeleteFriendSuccess.reducer)
  .handleAction(AddFriendSuccess.action, AddFriendSuccess.reducer)
  .handleAction(GetFriends.action, GetFriends.reducer)
  .handleAction(GetFriendsSuccess.action, GetFriendsSuccess.reducer)
  .handleAction(ResetSearchFriends.action, ResetSearchFriends.reducer)

  // socket-events
  .handleAction(UserContactsRemovedEventHandler.action, UserContactsRemovedEventHandler.reducer);

export default reducer;
