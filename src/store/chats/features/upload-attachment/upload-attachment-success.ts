import produce from 'immer';
import { IAttachmentBase } from 'kimbu-models';
import findIndex from 'lodash/findIndex';
import { SagaIterator } from 'redux-saga';
import { select, put } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';

import { MessageAttachmentsUploaded } from '@store/chats/features/upload-attachment/message-attachments-uploaded';
import { IAttachmentToSend } from '@store/chats/models';

import { IChatsState } from '../../chats-state';
import { getChatByIdDraftSelector, getChatByIdSelector } from '../../selectors';

import { IUploadAttachmentSuccessActionPayload } from './action-payloads/upload-attachment-success-action-payload';

export class UploadAttachmentSuccess {
  static get action() {
    return createAction('UPLOAD_ATTACHMENT_SUCCESS')<IUploadAttachmentSuccessActionPayload>();
  }

  static get reducer() {
    return produce(
      (draft: IChatsState, { payload }: ReturnType<typeof UploadAttachmentSuccess.action>) => {
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
      },
    );
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
