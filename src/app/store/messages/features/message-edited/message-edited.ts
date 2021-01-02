import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { getMessagesChatIndex, getMessage } from 'app/store/messages/selectors';
import { IMessagesState } from '../../models';
import { IMessageEditedActionPayload } from './message-edited-action-payload';

export class MessageEdited {
  static get action() {
    return createAction('MESSAGE_EDITED')<IMessageEditedActionPayload>();
  }

  static get reducer() {
    return produce((draft: IMessagesState, { payload }: ReturnType<typeof MessageEdited.action>) => {
      const { chatId, messageId, text, attachments } = payload;
      const chatIndex = getMessagesChatIndex(draft, chatId);

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
