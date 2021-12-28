import produce from 'immer';
import { createAction } from 'typesafe-actions';

import { IChatsState } from '../../chats-state';
import { getChatByIdDraftSelector } from '../../selectors';

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
          if (!chat.draftMessages[draftId]?.attachmentsToSend) {
            return draft;
          }

          const currentAttachment = chat.draftMessages[draftId]?.attachmentsToSend?.find(
            ({ attachment: attachmentToSend }) => attachmentToSend.id === attachmentId,
          );

          if (currentAttachment) {
            currentAttachment.progress = 100;
            currentAttachment.success = true;
            currentAttachment.attachment = { ...currentAttachment.attachment, ...attachment };
          }
        }
        return draft;
      },
    );
  }
}
