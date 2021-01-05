import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { getChatByIdDraftSelector } from 'app/store/chats/selectors';
import { IChatsState } from '../../models';
import { IAddUsersToGroupChatSuccessActionPayload } from './action-payloads/add-users-to-group-chat-success-action-payload';

export class AddUsersToGroupChatSuccess {
  static get action() {
    return createAction('ADD_USERS_TO_GROUP_CHAT_SUCCESS')<IAddUsersToGroupChatSuccessActionPayload>();
  }

  static get reducer() {
    return produce((draft: IChatsState, { payload }: ReturnType<typeof AddUsersToGroupChatSuccess.action>) => {
      const { chatId, users } = payload;

      const chat = getChatByIdDraftSelector(chatId, draft);

      if (chat) {
        chat.groupChat!.membersCount = chat.groupChat!.membersCount + users.length;
        chat.members.members = [...chat.members.members, ...users];
      }

      return draft;
    });
  }
}
