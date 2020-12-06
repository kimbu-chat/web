import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { getChatArrayIndex } from '../../chats-utils';
import { UploadAttachmentProgressData, ChatsState } from '../../models';

export class UploadAttachmentProgress {
  static get action() {
    return createAction('UPLOAD_ATTACHMENT_PROGRESS')<UploadAttachmentProgressData>();
  }

  static get reducer() {
    return produce((draft: ChatsState, { payload }: ReturnType<typeof UploadAttachmentProgress.action>) => {
      const { progress, chatId, attachmentId } = payload;

      const chatIndex: number = getChatArrayIndex(chatId, draft);

      if (chatIndex >= 0) {
        if (!draft.chats[chatIndex].attachmentsToSend) {
          return draft;
        }

        const currentAttachment = draft.chats[chatIndex].attachmentsToSend?.find(({ attachment }) => attachment.id === attachmentId);

        if (currentAttachment) {
          currentAttachment.progress = progress;
        }
      }
      return draft;
    });
  }
}