import { AddFriend } from './features/add-friend/add-friend';
import { DeleteFriend } from './features/delete-friend/delete-friend';
import { DismissToAddContact } from './features/dismiss-to-add-contact/dismiss-to-add-contact';
import { GetFriends } from './features/get-friends/get-friends';
import { GetUserByPhone } from './features/get-user-by-phone/get-user-by-phone';
import { ResetSearchFriends } from './features/reset-search-friends/reset-search-friends';
import { UserContactAddedEventHandler } from './socket-events/user-contact-added/user-contact-added-event-handler';
import { UserContactsRemovedEventHandler } from './socket-events/user-contacts-removed/user-contacts-removed-event-handler';

// FriendActions
export const getFriendsAction = GetFriends.action;
export const deleteFriendAction = DeleteFriend.action;
export const addFriendAction = AddFriend.action;
export const getUserByPhoneAction = GetUserByPhone.action;
export const dismissToAddContactAction = DismissToAddContact.action;
export const resetSearchFriendsAction = ResetSearchFriends.action;

// socket-events
export const userContactsRemovedEventHandlerAction = UserContactsRemovedEventHandler.action;
export const userContactAddedEventHandlerAction = UserContactAddedEventHandler.action;
