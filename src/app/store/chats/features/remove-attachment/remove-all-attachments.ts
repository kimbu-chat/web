import { SagaIterator } from 'redux-saga';
import { getChatByIdDraftSelector } from 'app/store/chats/selectors';
import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { removeUploadingAttachment, uploadingAttachments } from '../../upload-qeue';
import { IChatsState } from '../../chats-state';
import { IRemoveAllAttachmentsActionPayload } from './action-payloads/remove-all-attachments-action-payload';

export class RemoveAllAttachments {
  static get action() {
    return createAction('REMOVE_ALL_ATTACHMENTS')<IRemoveAllAttachmentsActionPayload>();
  }

  static get reducer() {
    return produce((draft: IChatsState) => {
      if (draft.selectedChatId) {
        const chat = getChatByIdDraftSelector(draft.selectedChatId, draft);

        if (chat) {
          chat.attachmentsToSend = [];
        }
      }

      return draft;
    });
  }

  static get saga() {
    return function* removeAllAttachmentsSaga(action: ReturnType<typeof RemoveAllAttachments.action>): SagaIterator {
      action.payload.ids.forEach((idToCancel) => {
        const uploadingAttachment = uploadingAttachments.find(({ id }) => id === idToCancel);

        uploadingAttachment?.cancelTokenSource.cancel();

        removeUploadingAttachment(idToCancel);
      });
    };
  }
}
