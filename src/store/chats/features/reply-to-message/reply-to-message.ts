import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { IReplyToMessageActionPayload } from './action-payloads/reply-to-message-action-payload';
import { getChatByIdDraftSelector } from '../../selectors';
import { IChatsState } from '../../chats-state';

export class ReplyToMessage {
  static get action() {
    return createAction('REPLY_TO_MESSAGE')<IReplyToMessageActionPayload>();
  }

  static get reducer() {
    return produce((draft: IChatsState, { payload }: ReturnType<typeof ReplyToMessage.action>) => {
      const { messageId } = payload;

      if (draft.selectedChatId) {
        const chat = getChatByIdDraftSelector(draft.selectedChatId, draft);

        const message = draft.messages[draft.selectedChatId].messages.find(
          ({ id }) => id === messageId,
        );

        if (chat) {
          chat.messageToReply = message;
          chat.messageToEdit = undefined;
        }
      }

      return draft;
    });
  }
}
