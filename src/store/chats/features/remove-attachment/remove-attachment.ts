import { createAction } from '@reduxjs/toolkit';
import { SagaIterator } from 'redux-saga';
import { apply } from 'redux-saga/effects';

import { IChatsState } from '../../chats-state';
import { getChatByIdDraftSelector } from '../../selectors';
import { removeUploadingAttachment } from '../../upload-qeue';


export interface IRemoveAttachmentActionPayload {
  attachmentId: number;
}

export class RemoveAttachment {
  static get action() {
    return createAction<IRemoveAttachmentActionPayload>('REMOVE_ATTACHMENT');
  }

  static get reducer() {
    return (draft: IChatsState, { payload }: ReturnType<typeof RemoveAttachment.action>) => {
        const { attachmentId } = payload;

        if (draft.selectedChatId) {
          const chat = getChatByIdDraftSelector(draft.selectedChatId, draft);

          if (chat && chat.draftMessageId) {
            const draftAttachments = chat.messages.messages[chat.draftMessageId].attachments;
            chat.messages.messages[chat.draftMessageId].attachments = draftAttachments.filter(
              (attachment) => attachment.id !== attachmentId,
            );
          }
        }

        return draft;
      };
  }

  static get saga() {
    return function* removeAttachment(
      action: ReturnType<typeof RemoveAttachment.action>,
    ): SagaIterator {
      const { attachmentId } = action.payload;
      yield apply(removeUploadingAttachment, removeUploadingAttachment, [attachmentId]);
    };
  }
}
