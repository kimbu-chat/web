import produce from 'immer';
import { createReducer } from 'typesafe-actions';
import unionBy from 'lodash/unionBy';
import { ChatActions } from '../chats/actions';
import { FriendsState } from './models';
import { AddFriendSuccess } from './features/add-friend-success';
import { DeleteFriendSuccess } from './features/delete-friend-success';
import { GetFriends } from './features/get-friends';
import { GetFriendsSuccess } from './features/get-friends-success';
import { UserStatusChangedEvent } from './features/user-status-changed-event';

const initialState: FriendsState = {
  loading: true,
  friends: [],
  hasMoreFriends: true,
  usersForSelectedGroupChat: [],
  groupChatUsersLoading: false,
};

const friends = createReducer<FriendsState>(initialState)
  .handleAction(DeleteFriendSuccess.action, DeleteFriendSuccess.reducer)
  .handleAction(UserStatusChangedEvent.action, UserStatusChangedEvent.reducer)
  .handleAction(AddFriendSuccess.action, AddFriendSuccess.reducer)
  .handleAction(GetFriends.action, GetFriends.reducer)
  .handleAction(GetFriendsSuccess.action, GetFriendsSuccess.reducer)
  .handleAction(
    ChatActions.getGroupChatUsers,
    produce((draft: FriendsState) => {
      draft.groupChatUsersLoading = true;
      return draft;
    }),
  )
  .handleAction(
    ChatActions.getGroupChatUsersSuccess,
    produce((draft: FriendsState, { payload }: ReturnType<typeof ChatActions.getGroupChatUsersSuccess>) => {
      draft.usersForSelectedGroupChat = unionBy(draft.usersForSelectedGroupChat, payload.users, 'id');

      return draft;
    }),
  )

  .handleAction(
    ChatActions.addUsersToGroupChatSuccess,
    produce((draft: FriendsState, { payload }: ReturnType<typeof ChatActions.addUsersToGroupChatSuccess>) => {
      const { users } = payload;

      draft.usersForSelectedGroupChat.push(...users);

      return draft;
    }),
  );

export default friends;
