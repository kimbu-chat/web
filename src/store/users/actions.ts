import { AddOrUpdateUsers } from './features/add-or-update-users/add-or-update-users';
import { UserActivatedEventHandler } from './socket-events/user-activated/user-activated-event-handler';
import { UserDeactivatedEventHandler } from './socket-events/user-deactivated/user-deactivated-event-handler';
import { UserDeletedEventHandler } from './socket-events/user-deleted/user-deleted';
import { UserEditedEventHandler } from './socket-events/user-edited/user-edited-event-handler';
import { UserPhoneNumberChangedEventHandler } from './socket-events/user-phone-number-changed/user-phone-number-changed';
import { UserStatusChangedEventHandler } from './socket-events/user-status-changed/user-status-changed-event-handler';

export const addOrUpdateUsers = AddOrUpdateUsers.action;
export const userStatusChangedEventHandler = UserStatusChangedEventHandler.action;
export const userDeactivatedEventHandler = UserDeactivatedEventHandler.action;
export const userDeletedEventHandler = UserDeletedEventHandler.action;
export const userPhoneNumberChangedEventHandler = UserPhoneNumberChangedEventHandler.action;
export const userEditedEventHandlerAction = UserEditedEventHandler.action;
export const userActivatedEventHandler = UserActivatedEventHandler.action;

export const UsersActions = {
  addOrUpdateUsers,
  userStatusChangedEventHandler,
  userEditedEventHandlerAction,
  userDeletedEventHandler,
  userDeactivatedEventHandler,
  userPhoneNumberChangedEventHandler,
  userActivatedEventHandler,
};
