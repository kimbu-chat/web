import { SagaIterator } from '@redux-saga/core';
import produce from 'immer';
import { call } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';

import { IChatsState } from '@store/chats/chats-state';
import { MessageState } from '@store/chats/models';
import { getChatByIdDraftSelector } from '@store/chats/selectors';

import { IUploadVoiceAttachmentSuccessActionPayload } from './action-payloads/upload-voice-attachment-success-action-payload';

export class UploadVoiceAttachmentSuccess {
  static get action() {
    return createAction(
      'UPLOAD_VOICE_ATTACHMENT_SUCCESS',
    )<IUploadVoiceAttachmentSuccessActionPayload>();
  }

  static get reducer() {
    return produce(
      (draft: IChatsState, { payload }: ReturnType<typeof UploadVoiceAttachmentSuccess.action>) => {
        const { oldId, attachmentId, attachmentUrl, messageId, chatId } = payload;

        const chat = getChatByIdDraftSelector(chatId, draft);
        const chatMessages = draft.chats[chatId]?.messages;

        const message = chatMessages?.messages[oldId];

        if (message && chatMessages) {
          message.clientId = message.id;
          message.id = messageId;
          message.state = MessageState.SENT;
          chatMessages.messages[messageId] = message;

          if (message.attachments && message.attachments[0]) {
            message.attachments[0].clientId = message.attachments[0].id;
            message.attachments[0].id = attachmentId;
            message.attachments[0].url = attachmentUrl;
          }

          delete chatMessages?.messages[oldId];

          const messageIndex = chatMessages.messageIds.indexOf(oldId);
          chatMessages.messageIds[messageIndex] = messageId;
        }

        if (chat) {
          if (chat.lastMessage?.id === oldId) {
            const lastMessage = chat.lastMessage || { id: 0, state: '' };

            lastMessage.id = messageId;

            lastMessage.state = MessageState.SENT;
          }
        }

        return draft;
      },
    );
  }

  static get saga() {
    return function* uploadVoiceAttachmentSuccessSaga(
      action: ReturnType<typeof UploadVoiceAttachmentSuccess.action>,
    ): SagaIterator {
      yield call(() => URL.revokeObjectURL(action.payload.oldAttachmentUrl));
    };
  }
}
