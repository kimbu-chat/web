import produce from 'immer';
import { SagaIterator } from 'redux-saga';
import { createAction } from 'typesafe-actions';
import { getChatByIdDraftSelector } from 'app/store/chats/selectors';
import { removeUploadingAttachment, uploadingAttachments } from '../../upload-qeue';
import { IRemoveAttachmentctionPayload } from './action-payloads/remove-attachment-action-payload';
import { IChatsState } from '../../chats-state';

export class RemoveAttachment {
  static get action() {
    return createAction('REMOVE_ATTACHMENT')<IRemoveAttachmentctionPayload>();
  }

  static get reducer() {
    return produce((draft: IChatsState, { payload }: ReturnType<typeof RemoveAttachment.action>) => {
      const { attachmentId } = payload;

      if (draft.selectedChatId) {
        const chat = getChatByIdDraftSelector(draft.selectedChatId, draft);

        if (chat) {
          chat.attachmentsToSend = chat.attachmentsToSend?.filter(({ attachment }) => attachment.id !== attachmentId);
        }
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
