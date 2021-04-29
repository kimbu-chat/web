import produce from 'immer';
import { createReducer } from 'typesafe-actions';
import { UserEditedEventHandler } from '../my-profile/socket-events/user-edited/user-edited-event-handler';
import { UpdateUsersList } from './features/update-users-list/update-users-list';
import { IUsersState } from './users-state';

const initialState: IUsersState = {
  users: {},
};

const reducer = createReducer<IUsersState>(initialState)
  .handleAction(UpdateUsersList.action, UpdateUsersList.reducer)

  // data maniputating
  .handleAction(
    UserEditedEventHandler.action,
    produce((draft: IUsersState, { payload }: ReturnType<typeof UserEditedEventHandler.action>) => {
      const {
        userId,
        firstName,
        lastName,
        nickname,
        avatarId,
        avatarUrl,
        avatarPreviewUrl,
      } = payload;

      const user = draft.users[userId];

      if (!user) {
        return draft;
      }

      user.firstName = firstName;
      user.lastName = lastName;
      user.nickname = nickname;

      user.avatar = {
        id: avatarId,
        url: avatarUrl,
        previewUrl: avatarPreviewUrl,
      };

      return draft;
    }),
  );
export default reducer;
