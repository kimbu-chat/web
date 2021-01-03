import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { getChatListChatIndex } from 'app/store/chats/selectors';
import { IChatsState } from '../../models';
import { IUploadAttachmentProgressActionPayload } from './upload-attachment-progress-action-payload';

export class UploadAttachmentProgress {
  static get action() {
    return createAction('UPLOAD_ATTACHMENT_PROGRESS')<IUploadAttachmentProgressActionPayload>();
  }

  static get reducer() {
    return produce((draft: IChatsState, { payload }: ReturnType<typeof UploadAttachmentProgress.action>) => {
      const { progress, chatId, attachmentId } = payload;

      const chatIndex: number = getChatListChatIndex(chatId, draft);

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
