import { AddFriend } from './features/add-friend/add-friend';
import { AddFriendSuccess } from './features/add-friend/add-friend-success';
import { DeleteFriend } from './features/delete-friend/delete-friend';
import { DeleteFriendSuccess } from './features/delete-friend/delete-friend-success';
import { GetFriends } from './features/get-friends/get-friends';
import { GetFriendsSuccess } from './features/get-friends/get-friends-success';
import { GetUserByPhone } from './features/get-user-by-phone/get-user-by-phone';
import { UserContactsRemovedEventHandler } from './socket-events/user-contacts-removed/user-contacts-removed-event-handler';
import { UserEditedEventHandler } from './socket-events/user-edited/user-edited-event-handler';
import { UserStatusChangedEventHandler } from './socket-events/user-status-changed/user-status-changed-event-handler';

export namespace FriendActions {
  export const getFriends = GetFriends.action;
  export const getFriendsSuccess = GetFriendsSuccess.action;
  export const deleteFriend = DeleteFriend.action;
  export const deleteFriendSuccess = DeleteFriendSuccess.action;
  export const addFriend = AddFriend.action;
  export const addFriendSuccess = AddFriendSuccess.action;
  export const getUserByPhone = GetUserByPhone.action;

  // socket-events
  export const userStatusChangedEvent = UserStatusChangedEventHandler.action;
  export const userContactsRemovedEventHandler = UserContactsRemovedEventHandler.action;
  export const userEditedEventHandler = UserEditedEventHandler.action;
}
