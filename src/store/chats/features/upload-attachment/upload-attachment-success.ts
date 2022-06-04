import { createAction } from '@reduxjs/toolkit';
import { IAttachmentBase } from 'kimbu-models';
import findIndex from 'lodash/findIndex';
import { SagaIterator } from 'redux-saga';
import { select, put } from 'redux-saga/effects';

import { MessageAttachmentsUploaded } from '@store/chats/features/upload-attachment/message-attachments-uploaded';
import { IAttachmentToSend } from '@store/chats/models';

import { IChatsState } from '../../chats-state';
import { getChatByIdDraftSelector, getChatByIdSelector } from '../../selectors';

export interface IUploadAttachmentSuccessActionPayload<T = IAttachmentBase> {
  draftId: number;
  chatId: number;
  attachmentId: number;
  attachment: T;
}

export class UploadAttachmentSuccess {
  static get action() {
    return createAction<IUploadAttachmentSuccessActionPayload>('UPLOAD_ATTACHMENT_SUCCESS');
  }

  static get reducer() {
    return (draft: IChatsState, { payload }: ReturnType<typeof UploadAttachmentSuccess.action>) => {
        const { chatId, attachmentId, attachment, draftId } = payload;

        const chat = getChatByIdDraftSelector(chatId, draft);

        if (chat) {
          if (!chat.messages.messages[draftId].attachments) {
            return draft;
          }

          const attachmentsToSend = chat.messages.messages[draftId].attachments;

          const currentAttachment = attachmentsToSend.find(
            (attachmentToSend) => attachmentToSend.id === attachmentId,
          ) as IAttachmentToSend & IAttachmentBase;

          if (currentAttachment) {
            currentAttachment.progress = 100;
            currentAttachment.success = true;

            const itemIdx = findIndex(attachmentsToSend, { id: currentAttachment.id });
            attachmentsToSend.splice(itemIdx, 1, { ...currentAttachment, ...attachment });
          }
        }
        return draft;
      };
  }

  static get saga() {
    return function* uploadAttachmentSuccessSaga({
      payload,
    }: ReturnType<typeof UploadAttachmentSuccess.action>): SagaIterator {
      const { chatId, draftId } = payload;
      const chat = yield select(getChatByIdSelector(chatId));

      if (chat) {
        const attachmentsToSend = chat.messages.messages[draftId].attachments;

        if (!attachmentsToSend.some((attch: IAttachmentToSend) => attch.success === false)) {
          yield put(MessageAttachmentsUploaded.action());
        }
      }
    };
  }
}
