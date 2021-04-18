import produce from 'immer';
import { unionBy } from 'lodash';
import { createAction } from 'typesafe-actions';
import { IChatsState } from '../../chats-state';
import { IBaseAttachment } from '../../models';
import { getChatByIdDraftSelector } from '../../selectors';
import { IMessageEditedIntegrationEvent } from './message-edited-integration-event';

export class MessageEditedEventHandler {
  static get action() {
    return createAction('MessageEdited')<IMessageEditedIntegrationEvent>();
  }

  static get reducer() {
    return produce(
      (draft: IChatsState, { payload }: ReturnType<typeof MessageEditedEventHandler.action>) => {
        const { chatId, messageId, text } = payload;

        // messages update

        const attachments: IBaseAttachment[] = JSON.parse(payload.attachments);
        const chat = getChatByIdDraftSelector(chatId, draft);
        const message = draft.messages[chatId].messages.find(({ id }) => id === messageId);

        if (!chat || !message) {
          return draft;
        }

        if (message) {
          message.text = text;
          message.isEdited = true;
          message.attachments = unionBy(message.attachments, attachments, 'id');
        }

        draft.messages[chatId].messages = draft.messages[chatId].messages.map((_, index) => {
          const msg = draft.messages[chatId].messages[index];

          if (msg.linkedMessage?.id === messageId) {
            msg.linkedMessage.text = text;
            msg.linkedMessage.isEdited = true;
            msg.linkedMessage.attachments = unionBy(
              msg.linkedMessage.attachments,
              attachments,
              'id',
            );
          }

          return msg;
        });

        if (chat.lastMessage) {
          if (chat.lastMessage.id === messageId) {
            chat.lastMessage.text = text;
            chat.lastMessage.isEdited = true;

            chat.lastMessage.attachments = unionBy(chat.lastMessage.attachments, attachments, 'id');
          }

          if (chat.lastMessage.linkedMessage && chat.lastMessage.linkedMessage.id === messageId) {
            chat.lastMessage.linkedMessage.text = text;
            chat.lastMessage.linkedMessage.attachments = attachments;
            chat.lastMessage.linkedMessage.isEdited = true;
          }
        }

        return draft;
      },
    );
  }
}
