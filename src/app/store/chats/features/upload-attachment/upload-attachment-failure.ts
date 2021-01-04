import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { getChatByIdDraftSelector } from 'app/store/chats/selectors';
import { IChatsState } from '../../models';
import { IUploadAttachmentFailureActionPayload } from './upload-attachment-failure-action-payload';

export class UploadAttachmentFailure {
  static get action() {
    return createAction('UPLOAD_ATTACHMENT_FAILURE')<IUploadAttachmentFailureActionPayload>();
  }

  static get reducer() {
    return produce((draft: IChatsState, { payload }: ReturnType<typeof UploadAttachmentFailure.action>) => {
      const { chatId, attachmentId } = payload;

      const chat = getChatByIdDraftSelector(chatId, draft);

      if (chat) {
        if (!chat.attachmentsToSend) {
          return draft;
        }

        const currentAttachment = chat.attachmentsToSend?.find(({ attachment }) => attachment.id === attachmentId);

        if (currentAttachment) {
          currentAttachment.success = false;
          currentAttachment.failure = true;
        }
      }
      return draft;
    });
  }
}
