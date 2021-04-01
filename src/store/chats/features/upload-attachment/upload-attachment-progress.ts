import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { getChatByIdDraftSelector } from '../../selectors';
import { IUploadAttachmentProgressActionPayload } from './action-payloads/upload-attachment-progress-action-payload';
import { IChatsState } from '../../chats-state';

export class UploadAttachmentProgress {
  static get action() {
    return createAction('UPLOAD_ATTACHMENT_PROGRESS')<IUploadAttachmentProgressActionPayload>();
  }

  static get reducer() {
    return produce(
      (draft: IChatsState, { payload }: ReturnType<typeof UploadAttachmentProgress.action>) => {
        const { progress, chatId, attachmentId, uploadedBytes } = payload;

        const chat = getChatByIdDraftSelector(chatId, draft);

        if (chat) {
          if (!chat.attachmentsToSend) {
            return draft;
          }

          const currentAttachment = chat.attachmentsToSend?.find(
            ({ attachment }) => attachment.id === attachmentId,
          );

          if (currentAttachment) {
            currentAttachment.progress = progress;
            currentAttachment.uploadedBytes = uploadedBytes;
          }
        }
        return draft;
      },
    );
  }
}
