import produce from 'immer';
import {
  AttachmentType,
  IAttachmentBase,
  IAudioAttachment,
  ICreateMessageRequest,
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

export class UploadVoiceAttachment {
  static get action() {
    return createAction('UPLOAD_VOICE_ATTACHMENT')<IUploadVoiceAttachmentActionPayload>();
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
          id: String(id),
          chatId: draft.selectedChatId,
          attachments: [
            {
              id,
              creationDateTime: new Date().toISOString(),
              url,
              byteSize: file.size,
              type: AttachmentType.Voice,
              waveFormJson,
              duration,
            } as IAudioAttachment as IAttachmentBase,
          ],
          isDeleted: false,
          isEdited: false,
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
      const { file, waveFormJson, id, url } = action.payload;

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
        attachments: [{ type: AttachmentType.Voice, id: uploadResponse.attachment.id }],
        clientId: String(id),
      };

      const { data: messageId } = CreateMessage.httpRequest.call(
        yield call(() => CreateMessage.httpRequest.generator(messageCreationReq)),
      );

      yield put(
        UploadVoiceAttachmentSuccess.action({
          oldId: id,
          chatId,
          attachmentId: uploadResponse.attachment.id,
          attachmentUrl: uploadResponse.attachment.url || '',
          oldAttachmentUrl: url,
          messageId,
        }),
      );
    };
  }
}
