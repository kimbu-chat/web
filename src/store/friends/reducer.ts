import { createReducer } from '@reduxjs/toolkit';

import { AddFriendSuccess } from './features/add-friend/add-friend-success';
import { DeleteFriendSuccess } from './features/delete-friend/delete-friend-success';
import { GetFriends } from './features/get-friends/get-friends';
import { GetFriendsSuccess } from './features/get-friends/get-friends-success';
import { ResetSearchFriends } from './features/reset-search-friends/reset-search-friends';
import { IFriendsState } from './friends-state';
import { UserContactAddedSuccessEventHandler } from './socket-events/user-contact-added/user-contact-added-success-event-handler';
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

const reducer = createReducer<IFriendsState>(initialState, (builder) =>
  builder
    .addCase(DeleteFriendSuccess.action, DeleteFriendSuccess.reducer)
    .addCase(AddFriendSuccess.action, AddFriendSuccess.reducer)
    .addCase(GetFriends.action, GetFriends.reducer)
    .addCase(GetFriendsSuccess.action, GetFriendsSuccess.reducer)
    .addCase(ResetSearchFriends.action, ResetSearchFriends.reducer)

    // socket-events
    .addCase(UserContactsRemovedEventHandler.action, UserContactsRemovedEventHandler.reducer)
    .addCase(
      UserContactAddedSuccessEventHandler.action,
      UserContactAddedSuccessEventHandler.reducer,
    ),
);

export default reducer;
