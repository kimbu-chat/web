import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { getChatListChatIndex } from 'app/store/chats/selectors';
import { IChatsState } from '../../models';
import { IUploadAttachmentFailureActionPayload } from './upload-attachment-failure-action-payload';

export class UploadAttachmentFailure {
  static get action() {
    return createAction('UPLOAD_ATTACHMENT_FAILURE')<IUploadAttachmentFailureActionPayload>();
  }

  static get reducer() {
    return produce((draft: IChatsState, { payload }: ReturnType<typeof UploadAttachmentFailure.action>) => {
      const { chatId, attachmentId } = payload;

      const chatIndex: number = getChatListChatIndex(chatId, draft);

      if (chatIndex >= 0) {
        if (!draft.chats[chatIndex].attachmentsToSend) {
          return draft;
        }

        const currentAttachment = draft.chats[chatIndex].attachmentsToSend?.find(({ attachment }) => attachment.id === attachmentId);

        if (currentAttachment) {
          currentAttachment.success = false;
          currentAttachment.failure = true;
        }
      }
      return draft;
    });
  }
}
