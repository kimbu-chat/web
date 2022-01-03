import produce from 'immer';
import { createAction } from 'typesafe-actions';

import { IChatsState } from '../../chats-state';
import { getChatByIdDraftSelector } from '../../selectors';

import { IReplyToMessageActionPayload } from './action-payloads/reply-to-message-action-payload';

export class ReplyToMessage {
  static get action() {
    return createAction('REPLY_TO_MESSAGE')<IReplyToMessageActionPayload>();
  }

  static get reducer() {
    return produce((draft: IChatsState, { payload }: ReturnType<typeof ReplyToMessage.action>) => {
      const { messageId } = payload;

      if (draft.selectedChatId) {
        const chat = getChatByIdDraftSelector(draft.selectedChatId, draft);
        const message = draft.chats[draft.selectedChatId]?.messages.messages[messageId];

        if (chat) {
          chat.messageToReply = message;
          chat.messageToEdit = undefined;
        }
      }

      return draft;
    });
  }
}
