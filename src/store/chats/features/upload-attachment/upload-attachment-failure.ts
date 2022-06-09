import { createAction } from '@reduxjs/toolkit';

import { IAttachmentToSend } from '@store/chats/models';

import { IChatsState } from '../../chats-state';
import { getChatByIdDraftSelector } from '../../selectors';

export interface IUploadAttachmentFailureActionPayload {
  chatId: number;
  attachmentId: number;
}

export class UploadAttachmentFailure {
  static get action() {
    return createAction<IUploadAttachmentFailureActionPayload>('UPLOAD_ATTACHMENT_FAILURE');
  }

  static get reducer() {
    return (draft: IChatsState, { payload }: ReturnType<typeof UploadAttachmentFailure.action>) => {
      const { chatId, attachmentId } = payload;

      const chat = getChatByIdDraftSelector(chatId, draft);

      if (chat && chat.draftMessageId) {
        const currentAttachment = chat.messages.messages[chat.draftMessageId].attachments.find(
          (attachment) => attachment.id === attachmentId,
        ) as IAttachmentToSend;

        if (currentAttachment) {
          currentAttachment.success = false;
          currentAttachment.failure = true;
        }
      }
      return draft;
    };
  }
}
