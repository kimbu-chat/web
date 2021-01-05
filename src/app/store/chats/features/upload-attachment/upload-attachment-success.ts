import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { getChatByIdDraftSelector } from 'app/store/chats/selectors';
import { IUploadAttachmentSuccessActionPayload } from './action-payloads/upload-attachment-success-action-payload';
import { IChatsState } from '../../models/chats-state';

export class UploadAttachmentSuccess {
  static get action() {
    return createAction('UPLOAD_ATTACHMENT_SUCCESS')<IUploadAttachmentSuccessActionPayload>();
  }

  static get reducer() {
    return produce((draft: IChatsState, { payload }: ReturnType<typeof UploadAttachmentSuccess.action>) => {
      const { chatId, attachmentId, attachment } = payload;

      const chat = getChatByIdDraftSelector(chatId, draft);

      if (chat) {
        if (!chat.attachmentsToSend) {
          return draft;
        }

        const currentAttachment = chat.attachmentsToSend?.find(({ attachment }) => attachment.id === attachmentId);

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
