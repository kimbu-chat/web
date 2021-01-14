import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { IChatsState, IBaseAttachment } from '../../models';
import { getChatByIdDraftSelector } from '../../selectors';
import { IMessageEditedIntegrationEvent } from './message-edited-integration-event';

export class MessageEditedEventHandler {
  static get action() {
    return createAction('MessageEdited')<IMessageEditedIntegrationEvent>();
  }

  static get reducer() {
    return produce((draft: IChatsState, { payload }: ReturnType<typeof MessageEditedEventHandler.action>) => {
      const { chatId, messageId, text } = payload;

      // messages update

      const attachments: IBaseAttachment[] = JSON.parse(payload.attachments);
      const chat = getChatByIdDraftSelector(chatId, draft);

      if (chat) {
        const message = chat.messages.messages.find(({ id }) => id === messageId);

        if (message) {
          message.text = text;
          message.attachments = attachments;
          message.isEdited = true;
        }

        const linkedMessages = chat.messages.messages.filter(({ linkedMessage }) => linkedMessage?.id === messageId);

        linkedMessages.forEach(({ linkedMessage }) => {
          if (linkedMessage) {
            linkedMessage.text = text;
            linkedMessage.attachments = attachments;
            linkedMessage.isEdited = true;
          }
        });

        if (chat.lastMessage) {
          if (chat.lastMessage.id === messageId) {
            chat.lastMessage.text = text;
            chat.lastMessage.attachments = attachments;
            chat.lastMessage.isEdited = true;
          }

          if (chat.lastMessage.linkedMessage && chat.lastMessage.linkedMessage.id === messageId) {
            chat.lastMessage.linkedMessage.text = text;
            chat.lastMessage.linkedMessage.attachments = attachments;
            chat.lastMessage.linkedMessage.isEdited = true;
          }
        }
      }

      return draft;
    });
  }
}
