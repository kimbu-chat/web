import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { getChatArrayIndex } from '../../chats-utils';
import { ChatsState } from '../../models';
import { UploadAttachmentSuccessActionPayload } from './upload-attachment-success-action-payload';

export class UploadAttachmentSuccess {
  static get action() {
    return createAction('UPLOAD_ATTACHMENT_SUCCESS')<UploadAttachmentSuccessActionPayload>();
  }

  static get reducer() {
    return produce((draft: ChatsState, { payload }: ReturnType<typeof UploadAttachmentSuccess.action>) => {
      const { chatId, attachmentId, attachment } = payload;

      const chatIndex: number = getChatArrayIndex(chatId, draft);

      if (chatIndex >= 0) {
        if (!draft.chats[chatIndex].attachmentsToSend) {
          return draft;
        }

        const currentAttachment = draft.chats[chatIndex].attachmentsToSend?.find(({ attachment }) => attachment.id === attachmentId);

        if (currentAttachment) {
          currentAttachment.progress = 100;
          currentAttachment.success = true;
          currentAttachment.attachment = { ...currentAttachment.attachment, ...attachment };
        }
      }
      return draft;
    });
  }
}
