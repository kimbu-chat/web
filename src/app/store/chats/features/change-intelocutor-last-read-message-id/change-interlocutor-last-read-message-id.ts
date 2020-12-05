import { MessageState } from 'app/store/messages/models';
import { MessagesReadIntegrationEvent } from 'app/store/middlewares/websockets/integration-events/messages-read-integration-event';
import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { ChatId } from '../../chat-id';
import { getChatArrayIndex } from '../../chats-utils';
import { ChatsState } from '../../models';

export class ChangeInterlocutorLastReadMessageId {
  static get action() {
    return createAction('GROUP_CHAT_MESSAGE_READ_FROM_EVENT')<MessagesReadIntegrationEvent>();
  }

  static get reducer() {
    return produce((draft: ChatsState, { payload }: ReturnType<typeof ChangeInterlocutorLastReadMessageId.action>) => {
      const { lastReadMessageId, userReaderId, objectType, groupChatId } = payload;

      const chatId = new ChatId().From(objectType === 'User' ? userReaderId : undefined, objectType === 'GroupChat' ? groupChatId : undefined).entireId;

      const chatIndex = getChatArrayIndex(chatId, draft);

      if (chatIndex >= 0) {
        draft.chats[chatIndex].interlocutorLastReadMessageId = lastReadMessageId;

        if (draft.chats[chatIndex].lastMessage?.id! <= lastReadMessageId) {
          draft.chats[chatIndex].lastMessage!.state = MessageState.READ;
        }
      }

      return draft;
    });
  }
}
