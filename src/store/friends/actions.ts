import { AddFriend } from './features/add-friend/add-friend';
import { AddFriendSuccess } from './features/add-friend/add-friend-success';
import { DeleteFriend } from './features/delete-friend/delete-friend';
import { DeleteFriendSuccess } from './features/delete-friend/delete-friend-success';
import { DismissToAddContact } from './features/dismiss-to-add-contact/dismiss-to-add-contact';
import { DismissToAddContactSuccess } from './features/dismiss-to-add-contact/dismiss-to-add-contact-success';
import { GetFriends } from './features/get-friends/get-friends';
import { GetFriendsSuccess } from './features/get-friends/get-friends-success';
import { GetUserByPhone } from './features/get-user-by-phone/get-user-by-phone';
import { ResetSearchFriends } from './features/reset-search-friends/reset-search-friends';
import { UserContactsRemovedEventHandler } from './socket-events/user-contacts-removed/user-contacts-removed-event-handler';
import { UserEditedEventHandler } from './socket-events/user-edited/user-edited-event-handler';
import { UserStatusChangedEventHandler } from './socket-events/user-status-changed/user-status-changed-event-handler';

// FriendActions
export const getFriendsAction = GetFriends.action;
export const getFriendsSuccessAction = GetFriendsSuccess.action;
export const deleteFriendAction = DeleteFriend.action;
export const deleteFriendSuccessAction = DeleteFriendSuccess.action;
export const addFriendAction = AddFriend.action;
export const addFriendSuccessAction = AddFriendSuccess.action;
export const getUserByPhoneAction = GetUserByPhone.action;
export const dismissToAddContactAction = DismissToAddContact.action;
export const dismissToAddContactSuccessAction = DismissToAddContactSuccess.action;
export const resetSearchFriendsAction = ResetSearchFriends.action;

// socket-events
export const userStatusChangedEventAction = UserStatusChangedEventHandler.action;
export const userContactsRemovedEventHandlerAction = UserContactsRemovedEventHandler.action;
export const userEditedEventHandlerAction = UserEditedEventHandler.action;

export const FriendActions = {
  // FriendActions
  getFriendsAction,
  resetSearchFriendsAction,
  getFriendsSuccessAction,
  deleteFriendAction,
  deleteFriendSuccessAction,
  addFriendAction,
  addFriendSuccessAction,
  getUserByPhoneAction,
  dismissToAddContactAction,
  dismissToAddContactSuccessAction,

  // socket-events
  userStatusChangedEventAction,
  userContactsRemovedEventHandlerAction,
  userEditedEventHandlerAction,
};
