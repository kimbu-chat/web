import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { getChatIndex, getMessage } from 'app/store/messages/selectors';
import { ReplyToMessageActionPayload } from './reply-to-message-action-payload';
import { MessagesState } from '../../models';

export class ReplyToMessage {
  static get action() {
    return createAction('REPLY_TO_MESSAGE')<ReplyToMessageActionPayload>();
  }

  static get reducer() {
    return produce((draft: MessagesState, { payload }: ReturnType<typeof ReplyToMessage.action>) => {
      draft.selectedMessageIds = [];

      const chatIndex = getChatIndex(draft, payload.chatId);

      const message = getMessage(draft.messages[chatIndex].messages, payload.messageId);
      message!.isSelected = false;

      draft.messageToReply = message;
      draft.messageToEdit = undefined;

      return draft;
    });
  }
}
