import produce from 'immer';
import { xorBy } from 'lodash';
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
        const shouldApplyAttachments =
          attachments && xorBy(message?.attachments, attachments, 'id').length !== 0;

        if (!chat || !message) {
          return draft;
        }

        if (message) {
          message.text = text;
          message.isEdited = true;

          if (shouldApplyAttachments) {
            message.attachments = attachments;
          }
        }

        draft.messages[chatId].messages.forEach((_, index) => {
          const msg = draft.messages[chatId].messages[index];

          if (msg.linkedMessage?.id === messageId) {
            msg.linkedMessage.text = text;
            msg.linkedMessage.isEdited = true;
            if (shouldApplyAttachments) {
              msg.linkedMessage.attachments = attachments;
            }
          }

          return msg;
        });

        if (chat.lastMessage) {
          if (chat.lastMessage.id === messageId) {
            chat.lastMessage.text = text;
            chat.lastMessage.isEdited = true;

            if (shouldApplyAttachments) {
              chat.lastMessage.attachments = attachments;
            }
          }

          if (chat.lastMessage.linkedMessage && chat.lastMessage.linkedMessage.id === messageId) {
            chat.lastMessage.linkedMessage.text = text;
            chat.lastMessage.linkedMessage.isEdited = true;

            if (shouldApplyAttachments) {
              chat.lastMessage.linkedMessage.attachments = attachments;
            }
          }
        }

        return draft;
      },
    );
  }
}
