import produce from 'immer';
import { SagaIterator } from 'redux-saga';
import { createAction } from 'typesafe-actions';
import { getChatArrayIndex } from '../../chats-utils';
import { ChatsState } from '../../models';
import { uploadingAttachments, removeUploadingAttachment } from '../../upload-qeue';
import { RemoveAttachmentctionPayload } from './remove-attachment-action-payload';

export class RemoveAttachment {
  static get action() {
    return createAction('REMOVE_ATTACHMENT')<RemoveAttachmentctionPayload>();
  }

  static get reducer() {
    return produce((draft: ChatsState, { payload }: ReturnType<typeof RemoveAttachment.action>) => {
      const { chatId, attachmentId } = payload;

      const chatIndex: number = getChatArrayIndex(chatId, draft);

      if (chatIndex >= 0) {
        if (!draft.chats[chatIndex].attachmentsToSend) {
          return draft;
        }

        draft.chats[chatIndex].attachmentsToSend = draft.chats[chatIndex].attachmentsToSend?.filter(({ attachment }) => attachment.id !== attachmentId);
      }

      return draft;
    });
  }

  static get saga() {
    return function* (action: ReturnType<typeof RemoveAttachment.action>): SagaIterator {
      const { attachmentId } = action.payload;

      const uploadingAttachment = uploadingAttachments.find(({ id }) => id === attachmentId);

      uploadingAttachment?.cancelTokenSource.cancel();

      removeUploadingAttachment(attachmentId);
    };
  }
}
