import produce from 'immer';
import {
  AttachmentType,
  IAudioAttachment,
  IPictureAttachment,
  IVideoAttachment,
  IVoiceAttachment,
} from 'kimbu-models';
import { SagaIterator } from 'redux-saga';
import { call } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';

import { removeSendMessageRequest } from '@utils/cancel-send-message-request';

import { IChatsState } from '../../chats-state';
import { getChatByIdDraftSelector } from '../../selectors';

import { ICreateMessageSuccessActionPayload } from './action-payloads/create-message-success-action-payload';

export class CreateMessageSuccess {
  static get action() {
    return createAction('CREATE_MESSAGE_SUCCESS')<ICreateMessageSuccessActionPayload>();
  }

  static get reducer() {
    return produce(
      (draft: IChatsState, { payload }: ReturnType<typeof CreateMessageSuccess.action>) => {
        const { messageState, chatId, draftMessageId, newMessageId, attachments } = payload;

        const chat = getChatByIdDraftSelector(chatId, draft);
        const chatMessages = draft.chats[chatId]?.messages;

        const message = chatMessages?.messages[draftMessageId];

        if (message && chatMessages) {
          message.clientId = message.id;
          message.id = newMessageId;
          message.state = messageState;
          message.creationDateTime = new Date().toISOString();
          chatMessages.messages[newMessageId] = message;

          if (draftMessageId) {
            delete chatMessages?.messages[draftMessageId];
          }

          const messageIndex = chatMessages.messageIds.indexOf(draftMessageId);
          chatMessages.messageIds[messageIndex] = newMessageId;
        }

        if (chat) {
          if (chat.lastMessageId === draftMessageId) {
            chat.lastMessageId = newMessageId;
          }

          // todo: unify
          attachments?.forEach((attachment) => {
            switch (attachment.type) {
              case AttachmentType.Audio:
                chat.audioAttachmentsCount = (chat.audioAttachmentsCount || 0) + 1;
                chat.audios.data.unshift({
                  ...(attachment as IAudioAttachment),
                  creationDateTime: new Date().toISOString(),
                });

                break;
              case AttachmentType.Picture:
                chat.pictureAttachmentsCount = (chat.pictureAttachmentsCount || 0) + 1;
                chat.photos.data.unshift({
                  ...(attachment as IPictureAttachment),
                  creationDateTime: new Date().toISOString(),
                });

                break;
              case AttachmentType.Raw:
                chat.rawAttachmentsCount = (chat.rawAttachmentsCount || 0) + 1;
                chat.files.data.unshift({
                  ...attachment,
                  creationDateTime: new Date().toISOString(),
                });

                break;
              case AttachmentType.Video:
                chat.videoAttachmentsCount = (chat.videoAttachmentsCount || 0) + 1;
                chat.videos.data.unshift({
                  ...(attachment as IVideoAttachment),
                  creationDateTime: new Date().toISOString(),
                });

                break;
              case AttachmentType.Voice:
                chat.voiceAttachmentsCount = (chat.voiceAttachmentsCount || 0) + 1;
                chat.recordings.data.unshift({
                  ...(attachment as IVoiceAttachment),
                  creationDateTime: new Date().toISOString(),
                });

                break;
              default:
                break;
            }
          });
        }

        return draft;
      },
    );
  }

  static get saga() {
    return function* createMessageSuccessSaga(
      action: ReturnType<typeof CreateMessageSuccess.action>,
    ): SagaIterator {
      yield call(removeSendMessageRequest, action.payload.draftMessageId);
    };
  }
}
