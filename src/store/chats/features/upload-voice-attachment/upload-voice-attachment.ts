import produce from 'immer';
import {
  AttachmentType,
  IAttachmentBase,
  ICreateMessageRequest,
  IVoiceAttachment,
  MessageLinkType,
  SystemMessageType,
} from 'kimbu-models';
import { SagaIterator } from 'redux-saga';
import { call, put, select, take } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';

import { MyProfileService } from '@services/my-profile-service';
import { IChatsState } from '@store/chats/chats-state';
import { INormalizedMessage, MessageState } from '@store/chats/models';
import { getSelectedChatIdSelector } from '@store/chats/selectors';

import { CreateMessage } from '../create-message/create-message';
import { UploadAttachmentRequest } from '../upload-attachment/upload-attachment-request';
import { UploadAttachmentSuccess } from '../upload-attachment/upload-attachment-success';

import { IUploadVoiceAttachmentActionPayload } from './action-payloads/upload-voice-attachment-action-payload';
import { UploadVoiceAttachmentSuccess } from './upload-voice-attachment-success';

interface IUploadVoiceReferred extends IUploadVoiceAttachmentActionPayload {
  linkedMessage?: INormalizedMessage;
  linkedMessageType: MessageLinkType;
}

export class UploadVoiceAttachment {
  static get action() {
    return createAction('UPLOAD_VOICE_ATTACHMENT')<IUploadVoiceReferred>();
  }

  static get reducer() {
    return produce(
      (draft: IChatsState, { payload }: ReturnType<typeof UploadVoiceAttachment.action>) => {
        const { file, waveFormJson, duration, id, url } = payload;

        if (!draft.selectedChatId) {
          return draft;
        }

        const chat = draft.chats[draft.selectedChatId];

        const currentUserId = new MyProfileService().myProfile.id;

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
          chat.lastMessage = message;

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
      },
    );
  }

  static get saga() {
    return function* uploadVoiceAttachmentSaga(
      action: ReturnType<typeof UploadVoiceAttachment.action>,
    ): SagaIterator {
      const chatId = yield select(getSelectedChatIdSelector);
      const { file, waveFormJson, id, url, linkedMessageType, linkedMessage } = action.payload;

      yield put(
        UploadAttachmentRequest.action({
          type: AttachmentType.Voice,
          attachmentId: id,
          file,
          waveFormJson,
          noStateChange: true,
        }),
      );

      const { payload: uploadResponse }: ReturnType<typeof UploadAttachmentSuccess.action> =
        yield take(UploadAttachmentSuccess.action);

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

      const { data } = CreateMessage.httpRequest.call(
        yield call(() => CreateMessage.httpRequest.generator(messageCreationReq)),
      );

      yield put(
        UploadVoiceAttachmentSuccess.action({
          oldId: id,
          chatId,
          attachmentId: uploadResponse.attachment.id,
          attachmentUrl: uploadResponse.attachment.url || '',
          oldAttachmentUrl: url,
          messageId: data.id,
        }),
      );
    };
  }
}
