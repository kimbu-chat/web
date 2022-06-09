import { createAction } from '@reduxjs/toolkit';
import { IAttachmentBase } from 'kimbu-models';
import xorBy from 'lodash/xorBy';

import { IChatsState } from '../../chats-state';
import { getChatByIdDraftSelector } from '../../selectors';

export interface IMessageEditedIntegrationEvent {
  attachments: string; // TODO: Check for a generic JSON that will receive BaseAttachment[]
  chatId: number;
  messageId: number;
  text: string;
}

export class MessageEditedEventHandler {
  static get action() {
    return createAction<IMessageEditedIntegrationEvent>('MessageEdited');
  }

  static get reducer() {
    return (
      draft: IChatsState,
      { payload }: ReturnType<typeof MessageEditedEventHandler.action>,
    ) => {
      const { chatId, messageId, text } = payload;

      // messages update

      const attachments: IAttachmentBase[] = JSON.parse(payload.attachments);
      const chat = getChatByIdDraftSelector(chatId, draft);
      const message = draft.chats[chatId]?.messages.messages[messageId];
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

      draft.chats[chatId]?.messages.messageIds.forEach((currentMessageId) => {
        const msg = draft.chats[chatId]?.messages.messages[currentMessageId];

        if (msg && msg.linkedMessage?.id === messageId) {
          msg.linkedMessage.text = text;
          msg.linkedMessage.isEdited = true;
          if (shouldApplyAttachments) {
            msg.linkedMessage.attachments = attachments;
          }
        }

        return msg;
      });

      return draft;
    };
  }
}
