import { createReducer } from 'typesafe-actions';

import { MyProfileService } from '@services/my-profile-service';
import { UserDeactivatedEventHandler } from '@store/users/socket-events/user-deactivated/user-deactivated-event-handler';
import { UserDeletedEventHandler } from '@store/users/socket-events/user-deleted/user-deleted';
import { UserPhoneNumberChangedEventHandler } from '@store/users/socket-events/user-phone-number-changed/user-phone-number-changed';

import { AddOrUpdateUsers } from './features/add-or-update-users/add-or-update-users';
import { UserActivatedEventHandler } from './socket-events/user-activated/user-activated-event-handler';
import { UserEditedEventHandler } from './socket-events/user-edited/user-edited-event-handler';
import { UserStatusChangedEventHandler } from './socket-events/user-status-changed/user-status-changed-event-handler';
import { IUsersState } from './users-state';

function initializeUsers() {
  const { myProfile } = new MyProfileService();

  if (myProfile) {
    return {
      users: {
        [myProfile.id]: myProfile,
      },
    };
  }

  return { users: {} };
}

const initialState: IUsersState = initializeUsers();

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
  )
  .handleAction(UserStatusChangedEventHandler.action, UserStatusChangedEventHandler.reducer);
export default reducer;
