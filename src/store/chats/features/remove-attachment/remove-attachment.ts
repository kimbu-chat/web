import produce from 'immer';
import { SagaIterator } from 'redux-saga';
import { createAction } from 'typesafe-actions';
import { apply } from 'redux-saga/effects';

import { getChatByIdDraftSelector } from '../../selectors';
import { removeUploadingAttachment } from '../../upload-qeue';
import { IChatsState } from '../../chats-state';

import { IRemoveAttachmentActionPayload } from './action-payloads/remove-attachment-action-payload';

export class RemoveAttachment {
  static get action() {
    return createAction('REMOVE_ATTACHMENT')<IRemoveAttachmentActionPayload>();
  }

  static get reducer() {
    return produce(
      (draft: IChatsState, { payload }: ReturnType<typeof RemoveAttachment.action>) => {
        const { attachmentId } = payload;

        if (draft.selectedChatId) {
          const chat = getChatByIdDraftSelector(draft.selectedChatId, draft);

          if (chat) {
            chat.attachmentsToSend = chat.attachmentsToSend?.filter(
              ({ attachment }) => attachment.id !== attachmentId,
            );
          }
        }

        return draft;
      },
    );
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
