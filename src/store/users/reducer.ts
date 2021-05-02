import { UserDeactivatedEventHandler } from '@store/users/socket-events/user-deactivated/user-deactivated-event-handler';
import { UserDeletedEventHandler } from '@store/users/socket-events/user-deleted/user-deleted';
import { UserPhoneNumberChangedEventHandler } from '@store/users/socket-events/user-phone-number-changed/user-phone-number-changed';
import produce from 'immer';
import { createReducer } from 'typesafe-actions';
import { UserEditedEventHandler } from './socket-events/user-edited/user-edited-event-handler';
import { UpdateUsersList } from './features/update-users-list/update-users-list';
import { IUsersState } from './users-state';

const initialState: IUsersState = {
  users: {},
};

const reducer = createReducer<IUsersState>(initialState)
  .handleAction(UpdateUsersList.action, UpdateUsersList.reducer)

  // data maniputating
  .handleAction(UserEditedEventHandler.action, UserEditedEventHandler.reducer)
  .handleAction(UserDeactivatedEventHandler.action, UserDeactivatedEventHandler.reducer)
  .handleAction(UserDeletedEventHandler.action, UserDeletedEventHandler.reducer)
  .handleAction(
    UserPhoneNumberChangedEventHandler.action,
    produce(
      (
        draft: IUsersState,
        { payload }: ReturnType<typeof UserPhoneNumberChangedEventHandler.action>,
      ) => {
        const { userId, phoneNumber } = payload;
        const user = draft.users[userId];

        if (user) {
          user.phoneNumber = phoneNumber;
        }

        return draft;
      },
    ),
  );
export default reducer;
