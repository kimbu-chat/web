import { createReducer } from 'typesafe-actions';
import { UserDeactivatedEventHandler } from '@store/my-profile/socket-events/user-deactivated/user-deactivated-event-handler';
import produce from 'immer';
import { UserEditedEventHandler } from './socket-events/user-edited/user-edited-event-handler';
import { AddFriendSuccess } from './features/add-friend/add-friend-success';
import { DeleteFriendSuccess } from './features/delete-friend/delete-friend-success';
import { GetFriends } from './features/get-friends/get-friends';
import { GetFriendsSuccess } from './features/get-friends/get-friends-success';
import { UserStatusChangedEventHandler } from './socket-events/user-status-changed/user-status-changed-event-handler';
import { UserContactsRemovedEventHandler } from './socket-events/user-contacts-removed/user-contacts-removed-event-handler';
import { IFriendsState } from './friends-state';
import { ResetSearchFriends } from './features/reset-search-friends/reset-search-friends';
import { getUserDraftSelector } from './selectors';

const initialState: IFriendsState = {
  friends: {
    friends: [],
    hasMore: true,
    loading: false,
  },
  searchFriends: {
    friends: [],
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
  .handleAction(UserStatusChangedEventHandler.action, UserStatusChangedEventHandler.reducer)
  .handleAction(UserContactsRemovedEventHandler.action, UserContactsRemovedEventHandler.reducer)
  .handleAction(UserEditedEventHandler.action, UserEditedEventHandler.reducer)
  .handleAction(
    UserDeactivatedEventHandler.action,
    produce(
      (
        draft: IFriendsState,
        { payload }: ReturnType<typeof UserDeactivatedEventHandler.action>,
      ) => {
        const { userId } = payload;
        const user = getUserDraftSelector(userId, draft);

        if (user) {
          user.deactivated = true;
        }

        return draft;
      },
    ),
  );

export default reducer;
