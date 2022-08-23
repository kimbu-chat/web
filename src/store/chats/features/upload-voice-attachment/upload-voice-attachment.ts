import { createAction } from '@reduxjs/toolkit';
import { AttachmentType, IAttachmentBase, ICreateMessageRequest, IVoiceAttachment, MessageLinkType, SystemMessageType } from 'kimbu-models';
import { SagaIterator } from 'redux-saga';
import { call, put, select, take } from 'redux-saga/effects';

import { MyProfileService } from '@services/my-profile-service';
import { IChatsState } from '@store/chats/chats-state';
import { INormalizedMessage, MessageState } from '@store/chats/models';
import { getSelectedChatIdSelector } from '@store/chats/selectors';

import { CreateMessage } from '../create-message/create-message';
import { UploadAttachmentRequest } from '../upload-attachment/upload-attachment-request';
import { UploadAttachmentSuccess } from '../upload-attachment/upload-attachment-success';

import { UploadVoiceAttachmentSuccess } from './upload-voice-attachment-success';

interface IUploadVoiceReferred extends IUploadVoiceAttachmentActionPayload {
  linkedMessage?: INormalizedMessage;
  linkedMessageType?: MessageLinkType;
}

export interface IUploadVoiceAttachmentActionPayload {
  file: File;
  waveFormJson?: string;
  duration: number;
  id: number;
  // url: string;
}

export class UploadVoiceAttachment {
  static get action() {
    return createAction<IUploadVoiceReferred>('UPLOAD_VOICE_ATTACHMENT');
  }

  static get reducer() {
    return (draft: IChatsState, { payload }: ReturnType<typeof UploadVoiceAttachment.action>) => {
      const { file, waveFormJson, duration, id } = payload;

      if (!draft.selectedChatId) {
        return draft;
      }

      const chat = draft.chats[draft.selectedChatId];

      const currentUserId = new MyProfileService().myProfile.id;

      const url = URL.createObjectURL(file);

      const message: INormalizedMessage = {
        systemMessageType: SystemMessageType.None,
        userCreatorId: currentUserId,
        creationDateTime: new Date().toISOString(),
        state: MessageState.QUEUED,
        id,
        chatId: draft.selectedChatId,
        attachments: [
          {
            id,
            clientId: id,
            creationDateTime: new Date().toISOString(),
            url,
            byteSize: file.size,
            type: AttachmentType.Voice,
            waveFormJson,
            duration,
          } as IVoiceAttachment as IAttachmentBase,
        ],
        isDeleted: false,
        isEdited: false,
        linkedMessage: payload.linkedMessage,
        linkedMessageType: payload.linkedMessageType,
      };

      if (chat) {
        chat.lastMessageId = message.id;

        const chatIndex = draft.chatList.chatIds.indexOf(chat.id);
        if (chatIndex !== 0) {
          draft.chatList.chatIds.splice(chatIndex, 1);

          draft.chatList.chatIds.unshift(chat.id);
        }
      }

      const chatMessages = draft.chats[message.chatId]?.messages;

      if (chatMessages && !chatMessages.messages[message.id]) {
        chatMessages.messages[message.id] = message;
        chatMessages.messageIds.unshift(message.id);
      }
      return draft;
    };
  }

  static get saga() {
    return function* uploadVoiceAttachmentSaga(action: ReturnType<typeof UploadVoiceAttachment.action>): SagaIterator {
      const chatId = yield select(getSelectedChatIdSelector);
      const { file, waveFormJson, id, linkedMessageType, linkedMessage } = action.payload;

      yield put(
        UploadAttachmentRequest.action({
          chatId,
          type: AttachmentType.Voice,
          attachmentId: id,
          file,
          waveFormJson,
          noStateChange: true,
        }),
      );

      const { payload: uploadResponse }: ReturnType<typeof UploadAttachmentSuccess.action> = yield take(UploadAttachmentSuccess.action);

      const messageCreationReq: ICreateMessageRequest = {
        chatId,
        attachmentIds: [uploadResponse.attachment.id],
        clientId: id,
      };

      if (linkedMessageType && linkedMessage) {
        messageCreationReq.link = {
          type: linkedMessageType,
          originalMessageId: linkedMessage?.id,
        };
      }

      const { data } = CreateMessage.httpRequest.call(yield call(() => CreateMessage.httpRequest.generator(messageCreationReq)));

      yield put(
        UploadVoiceAttachmentSuccess.action({
          oldId: id,
          chatId,
          attachmentId: uploadResponse.attachment.id,
          attachmentUrl: uploadResponse.attachment.url || '',
          messageId: data.id,
        }),
      );
    };
  }
}
