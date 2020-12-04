import { AddFriend } from './features/add-friend';
import { AddFriendSuccess } from './features/add-friend-success';
import { DeleteFriend } from './features/delete-friend';
import { DeleteFriendSuccess } from './features/delete-friend-success';
import { GetFriends } from './features/get-friends';
import { GetFriendsSuccess } from './features/get-friends-success';
import { UserStatusChangedEvent } from './features/user-status-changed-event';

export namespace FriendActions {
  export const getFriends = GetFriends.action;
  export const getFriendsSuccess = GetFriendsSuccess.action;
  export const deleteFriend = DeleteFriend.action;
  export const deleteFriendSuccess = DeleteFriendSuccess.action;
  export const userStatusChangedEvent = UserStatusChangedEvent.action;
  export const addFriend = AddFriend.action;
  export const addFriendSuccess = AddFriendSuccess.action;
}
