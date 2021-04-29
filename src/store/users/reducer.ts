import { GetChatsSuccess } from '@store/chats/features/get-chats/get-chats-success';
import { GetMessagesSuccess } from '@store/chats/features/get-messages/get-messages-success';
import { UnshiftChat } from '@store/chats/features/unshift-chat/unshift-chat';
import { MessagesDeletedIntegrationEventHandlerSuccess } from '@store/chats/socket-events/message-deleted/messages-deleted-integration-event-handler-success';
import produce from 'immer';
import { createReducer } from 'typesafe-actions';
import { UserEditedEventHandler } from '../my-profile/socket-events/user-edited/user-edited-event-handler';
import { IUsersState } from './users-state';

const initialState: IUsersState = {
  users: {},
};

const reducer = createReducer<IUsersState>(initialState)
  .handleAction(
    GetMessagesSuccess.action,
    produce((draft: IUsersState, { payload }: ReturnType<typeof GetMessagesSuccess.action>) => {
      const { users } = payload;

      draft.users = { ...draft.users, ...users };

      return draft;
    }),
  )
  .handleAction(
    GetChatsSuccess.action,
    produce((draft: IUsersState, { payload }: ReturnType<typeof GetChatsSuccess.action>) => {
      const { users } = payload;

      draft.users = { ...draft.users, ...users };

      return draft;
    }),
  )
  .handleAction(
    MessagesDeletedIntegrationEventHandlerSuccess.action,
    produce(
      (
        draft: IUsersState,
        { payload }: ReturnType<typeof MessagesDeletedIntegrationEventHandlerSuccess.action>,
      ) => {
        const { users } = payload;

        draft.users = { ...draft.users, ...users };

        return draft;
      },
    ),
  )
  .handleAction(
    UnshiftChat.action,
    produce((draft: IUsersState, { payload }: ReturnType<typeof UnshiftChat.action>) => {
      const { users } = payload;

      draft.users = { ...draft.users, ...users };

      return draft;
    }),
  )

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
