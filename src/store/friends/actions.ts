import { AddFriendSuccess } from './features/add-friend/add-friend-success';
import { AddFriend } from './features/add-friend/add-friend';
import { DeleteFriendSuccess } from './features/delete-friend/delete-friend-success';
import { DeleteFriend } from './features/delete-friend/delete-friend';
import { DismissToAddContactSuccess } from './features/dismiss-to-add-contact/dismiss-to-add-contact-success';
import { DismissToAddContact } from './features/dismiss-to-add-contact/dismiss-to-add-contact';
import { GetFriendsSuccess } from './features/get-friends/get-friends-success';
import { GetFriends } from './features/get-friends/get-friends';
import { GetUserByPhone } from './features/get-user-by-phone/get-user-by-phone';
import { ResetSearchFriends } from './features/reset-search-friends/reset-search-friends';
import { UserContactAddedEventHandler } from './socket-events/user-contact-added/user-contact-added-event-handler';
import { UserContactAddedSuccessEventHandler } from './socket-events/user-contact-added/user-contact-added-success-event-handler';
import { UserContactsRemovedEventHandler } from './socket-events/user-contacts-removed/user-contacts-removed-event-handler';

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
export const userContactsRemovedEventHandlerAction = UserContactsRemovedEventHandler.action;
export const userContactAddedSuccessEventHandlerAction = UserContactAddedSuccessEventHandler.action;
export const userContactAddedEventHandlerAction = UserContactAddedEventHandler.action;

export type FriendActions =
  // FriendActions
  typeof getFriendsAction &
    typeof resetSearchFriendsAction &
    typeof getFriendsSuccessAction &
    typeof deleteFriendAction &
    typeof deleteFriendSuccessAction &
    typeof addFriendAction &
    typeof addFriendSuccessAction &
    typeof getUserByPhoneAction &
    typeof dismissToAddContactAction &
    typeof dismissToAddContactSuccessAction &
    // socket-events
    typeof userContactsRemovedEventHandlerAction &
    typeof userContactAddedSuccessEventHandlerAction &
    typeof userContactAddedEventHandlerAction;
