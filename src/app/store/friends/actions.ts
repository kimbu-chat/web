import { AddFriend } from './features/add-friend/add-friend';
import { AddFriendSuccess } from './features/add-friend/add-friend-success';
import { DeleteFriend } from './features/delete-friend/delete-friend';
import { DeleteFriendSuccess } from './features/delete-friend/delete-friend-success';
import { GetFriends } from './features/get-friends/get-friends';
import { GetFriendsSuccess } from './features/get-friends/get-friends-success';
import { UserStatusChangedEventHandler } from './socket-events/user-status-changed/user-status-changed-event-handler';

export namespace FriendActions {
  export const getFriends = GetFriends.action;
  export const getFriendsSuccess = GetFriendsSuccess.action;
  export const deleteFriend = DeleteFriend.action;
  export const deleteFriendSuccess = DeleteFriendSuccess.action;
  export const addFriend = AddFriend.action;
  export const addFriendSuccess = AddFriendSuccess.action;

  // socket-events
  export const userStatusChangedEvent = UserStatusChangedEventHandler.action;
}
