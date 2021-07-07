import produce from 'immer';
import { createAction } from 'typesafe-actions';

import { IChatsState } from '../../chats-state';
import { getChatByIdDraftSelector } from '../../selectors';

import { IAddUsersToGroupChatSuccessActionPayload } from './action-payloads/add-users-to-group-chat-success-action-payload';

export class AddUsersToGroupChatSuccess {
  static get action() {
    return createAction(
      'ADD_USERS_TO_GROUP_CHAT_SUCCESS',
    )<IAddUsersToGroupChatSuccessActionPayload>();
  }

  static get reducer() {
    return produce(
      (draft: IChatsState, { payload }: ReturnType<typeof AddUsersToGroupChatSuccess.action>) => {
        const { chatId, userIds } = payload;

        const chat = getChatByIdDraftSelector(chatId, draft);

        if (chat?.groupChat) {
          chat.groupChat.membersCount += userIds.length;
          chat.members.memberIds = [...new Set([...chat.members.memberIds, ...userIds])];
        }

        return draft;
      },
    );
  }
}
