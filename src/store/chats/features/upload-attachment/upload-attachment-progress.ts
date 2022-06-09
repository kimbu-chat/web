import { createAction } from '@reduxjs/toolkit';

import { IAttachmentToSend } from '@store/chats/models';

import { IChatsState } from '../../chats-state';
import { getChatByIdDraftSelector } from '../../selectors';

export interface IUploadAttachmentProgressActionPayload {
  draftId: number;
  chatId: number;
  attachmentId: number;
  progress: number;
  uploadedBytes: number;
}

export class UploadAttachmentProgress {
  static get action() {
    return createAction<IUploadAttachmentProgressActionPayload>('UPLOAD_ATTACHMENT_PROGRESS');
  }

  static get reducer() {
    return (
      draft: IChatsState,
      { payload }: ReturnType<typeof UploadAttachmentProgress.action>,
    ) => {
      const { progress, chatId, attachmentId, uploadedBytes, draftId } = payload;

      const chat = getChatByIdDraftSelector(chatId, draft);

      if (chat) {
        if (!chat.messages.messages[draftId].attachments) {
          return draft;
        }

        const currentAttachment = chat.messages.messages[draftId].attachments?.find(
          (attachment) => attachment.id === attachmentId,
        ) as IAttachmentToSend;

        if (currentAttachment) {
          currentAttachment.progress = progress;
          currentAttachment.uploadedBytes = uploadedBytes;
        }
      }
      return draft;
    };
  }
}
