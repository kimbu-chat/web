import { UserEditedEventHandler } from './socket-events/user-edited/user-edited-event-handler';
import { UpdateUsersList } from './features/update-users-list/update-users-list';
import { UserDeactivatedEventHandler } from './socket-events/user-deactivated/user-deactivated-event-handler';
import { UserDeletedEventHandler } from './socket-events/user-deleted/user-deleted';
import { UserPhoneNumberChangedEventHandler } from './socket-events/user-phone-number-changed/user-phone-number-changed';
import { UserStatusChangedEventHandler } from './socket-events/user-status-changed/user-status-changed-event-handler';

export const updateUsersList = UpdateUsersList.action;
export const userStatusChangedEventHandler = UserStatusChangedEventHandler.action;
export const userDeactivatedEventHandler = UserDeactivatedEventHandler.action;
export const userDeletedEventHandler = UserDeletedEventHandler.action;
export const userPhoneNumberChangedEventHandler = UserPhoneNumberChangedEventHandler.action;
export const userEditedEventHandlerAction = UserEditedEventHandler.action;

export const UsersActions = {
  updateUsersList,
  userStatusChangedEventHandler,
  userEditedEventHandlerAction,
  userDeletedEventHandler,
  userDeactivatedEventHandler,
  userPhoneNumberChangedEventHandler,
};
