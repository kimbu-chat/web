import { MessageState } from 'app/store/messages/models';
import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { getChatArrayIndex } from 'app/store/chats/selectors';
import { IChatsState } from '../../models';
import { IChangeInterlocutorLastReadMessageIdActionPayload } from './change-interlocutor-last-read-message-id-action-payload';

export class ChangeInterlocutorLastReadMessageId {
  static get action() {
    return createAction('GROUP_CHAT_MESSAGE_READ_FROM_EVENT')<IChangeInterlocutorLastReadMessageIdActionPayload>();
  }

  static get reducer() {
    return produce((draft: IChatsState, { payload }: ReturnType<typeof ChangeInterlocutorLastReadMessageId.action>) => {
      const { lastReadMessageId, chatId } = payload;

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
