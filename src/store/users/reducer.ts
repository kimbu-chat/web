import { UserDeactivatedEventHandler } from '@store/users/socket-events/user-deactivated/user-deactivated-event-handler';
import { UserDeletedEventHandler } from '@store/users/socket-events/user-deleted/user-deleted';
import { UserPhoneNumberChangedEventHandler } from '@store/users/socket-events/user-phone-number-changed/user-phone-number-changed';
import { createReducer } from 'typesafe-actions';
import { UserEditedEventHandler } from './socket-events/user-edited/user-edited-event-handler';
import { AddOrUpdateUsers } from './features/add-or-update-users/add-or-update-users';
import { IUsersState } from './users-state';
import { UserActivatedEventHandler } from './socket-events/user-activated/user-activated-event-handler';

const initialState: IUsersState = {
  users: {},
};

const reducer = createReducer<IUsersState>(initialState)
  .handleAction(AddOrUpdateUsers.action, AddOrUpdateUsers.reducer)

  // data maniputating
  .handleAction(UserEditedEventHandler.action, UserEditedEventHandler.reducer)
  .handleAction(UserDeactivatedEventHandler.action, UserDeactivatedEventHandler.reducer)
  .handleAction(UserActivatedEventHandler.action, UserActivatedEventHandler.reducer)
  .handleAction(UserDeletedEventHandler.action, UserDeletedEventHandler.reducer)
  .handleAction(
    UserPhoneNumberChangedEventHandler.action,
    UserPhoneNumberChangedEventHandler.reducer,
  );
export default reducer;
