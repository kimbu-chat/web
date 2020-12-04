import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { getChatIndex, getMessage } from '../messages-utils';
import { MessageEdited as MessageEditedActionPayload, MessagesState } from '../models';

export class MessageEdited {
  static get action() {
    return createAction('MESSAGE_EDITED')<MessageEditedActionPayload>();
  }

  static get reducer() {
    return produce((draft: MessagesState, { payload }: ReturnType<typeof MessageEdited.action>) => {
      const { chatId, messageId, text, attachments } = payload;
      const chatIndex = getChatIndex(draft, chatId);

      if (chatIndex !== -1) {
        const message = getMessage(draft.messages[chatIndex].messages, messageId);

        if (message) {
          message.text = text;
          message.attachments = attachments;
          message.isEdited = true;
        }
      }

      return draft;
    });
  }
}
