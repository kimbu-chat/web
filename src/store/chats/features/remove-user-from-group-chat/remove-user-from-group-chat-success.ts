import produce from 'immer';
import { createAction } from 'typesafe-actions';

import { ChatId } from '@store/chats/chat-id';
import { IChatsState } from '@store/chats/chats-state';
import { getChatByIdDraftSelector } from '@store/chats/selectors';

import { IRemoveUserFromGroupChatSuccessActionPayload } from './action-payloads/remove-user-from-group-chat-success-payload';

export class RemoveUserFromGroupChatSuccess {
  static get action() {
    return createAction(
      'REMOVE_USER_FROM_GROUP_CHAT_SUCCESS',
    )<IRemoveUserFromGroupChatSuccessActionPayload>();
  }

  static get reducer() {
    return produce(
      (
        draft: IChatsState,
        { payload }: ReturnType<typeof RemoveUserFromGroupChatSuccess.action>,
      ) => {
        const { userId, groupChatId } = payload;

        const chatId = ChatId.from(undefined, groupChatId).id;

        const chat = getChatByIdDraftSelector(chatId, draft);

        if (chat?.groupChat) {
          chat.groupChat.membersCount -= 1;
          chat.members.memberIds = chat.members.memberIds.filter((id) => id !== userId);
        }

        // TODO: handle user deletion

        return draft;
      },
    );
  }
}
