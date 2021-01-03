import produce from 'immer';
import { SagaIterator } from 'redux-saga';
import { createAction } from 'typesafe-actions';
import { getChatListChatIndex } from 'app/store/chats/selectors';
import { IChatsState } from '../../models';
import { removeUploadingAttachment, uploadingAttachments } from '../../upload-qeue';
import { IRemoveAttachmentctionPayload } from './remove-attachment-action-payload';

export class RemoveAttachment {
  static get action() {
    return createAction('REMOVE_ATTACHMENT')<IRemoveAttachmentctionPayload>();
  }

  static get reducer() {
    return produce((draft: IChatsState, { payload }: ReturnType<typeof RemoveAttachment.action>) => {
      const { chatId, attachmentId } = payload;

      const chatIndex: number = getChatListChatIndex(chatId, draft);

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
