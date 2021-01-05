import { IChatsState } from 'store/chats/models';
import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { IReplyToMessageActionPayload } from './action-payloads/reply-to-message-action-payload';
import { getMessageDraftSelector } from '../../selectors';

export class ReplyToMessage {
  static get action() {
    return createAction('REPLY_TO_MESSAGE')<IReplyToMessageActionPayload>();
  }

  static get reducer() {
    return produce((draft: IChatsState, { payload }: ReturnType<typeof ReplyToMessage.action>) => {
      const { messageId } = payload;
      draft.selectedMessageIds = [];

      const message = getMessageDraftSelector(draft.selectedChatId, messageId, draft);

      if (message) {
        message.isSelected = false;
      }

      draft.messageToReply = message;
      draft.messageToEdit = undefined;

      return draft;
    });
  }
}
