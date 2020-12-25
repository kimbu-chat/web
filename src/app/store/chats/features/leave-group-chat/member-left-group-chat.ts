import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { getChatArrayIndex } from 'app/store/chats/selectors';
import { ChatId } from '../../chat-id';
import { ChatsState } from '../../models';
import { MemberLeftGroupChatActionPayload } from './member-left-group-chat-action-payload';

export class MemberLeftGroupChat {
  static get action() {
    return createAction('GROUP_CHAT_LEFT')<MemberLeftGroupChatActionPayload>();
  }

  static get reducer() {
    return produce((draft: ChatsState, { payload }: ReturnType<typeof MemberLeftGroupChat.action>) => {
      const { groupChatId, userId, isCurrentUserEventCreator } = payload;
      const chatId = ChatId.from(undefined, groupChatId).id;

      if (isCurrentUserEventCreator) {
        draft.chats = draft.chats.filter((chat) => chat.groupChat?.id !== groupChatId);

        if (draft.selectedChatId === chatId) {
          draft.selectedChatId = null;
        }
      } else {
        const chatIndex: number = getChatArrayIndex(chatId, draft);

        draft.chats[chatIndex].members.members = draft.chats[chatIndex].members.members.filter(({ id }) => id !== userId);
      }

      return draft;
    });
  }
}
