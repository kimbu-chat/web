import produce from 'immer';
import { createAction } from 'typesafe-actions';

import { IChatsState } from '../../chats-state';
import { getChatByIdDraftSelector } from '../../selectors';

export interface IMarkChatAsReadSuccessActionPayload {
  chatId: number;
  lastReadMessageId: number;
}

export class MarkChatAsReadSuccess {
  static get action() {
    return createAction('MARK_CHAT_AS_READ_SUCCESS')<IMarkChatAsReadSuccessActionPayload>();
  }

  static get reducer() {
    return produce(
      (draft: IChatsState, { payload }: ReturnType<typeof MarkChatAsReadSuccess.action>) => {
        const { chatId } = payload;

        const chat = getChatByIdDraftSelector(chatId, draft);

        if (chat) {
          chat.unreadMessagesCount = 0;
        }

        return draft;
      },
    );
  }
}
