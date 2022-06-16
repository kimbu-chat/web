import { createAction } from '@reduxjs/toolkit';

import { IChatsState } from '@store/chats/chats-state';
import { MessageState } from '@store/chats/models';
import { getChatByIdDraftSelector } from '@store/chats/selectors';

export interface IUploadVoiceAttachmentSuccessActionPayload {
  oldId: number;
  chatId: number;
  attachmentId: number;
  attachmentUrl: string;
  messageId: number;
}

export class UploadVoiceAttachmentSuccess {
  static get action() {
    return createAction<IUploadVoiceAttachmentSuccessActionPayload>(
      'UPLOAD_VOICE_ATTACHMENT_SUCCESS',
    );
  }

  static get reducer() {
    return (
      draft: IChatsState,
      { payload }: ReturnType<typeof UploadVoiceAttachmentSuccess.action>,
    ) => {
      const { oldId, attachmentId, messageId, chatId } = payload;

      const chat = getChatByIdDraftSelector(chatId, draft);
      const chatMessages = draft.chats[chatId]?.messages;

      const message = chatMessages?.messages[oldId];

      if (message && chatMessages) {
        message.clientId = message.id;
        message.id = messageId;
        message.state = MessageState.SENT;
        chatMessages.messages[messageId] = message;

        if (message.attachments && message.attachments[0]) {
          message.attachments[0].id = attachmentId;
        }

        delete chatMessages?.messages[oldId];

        const messageIndex = chatMessages.messageIds.indexOf(oldId);
        chatMessages.messageIds[messageIndex] = messageId;
      }

      if (chat) {
        if (chat.lastMessageId === oldId) {
          chat.lastMessageId = messageId;
        }
      }

      return draft;
    };
  }
}
