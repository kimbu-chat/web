import produce from 'immer';
import { SagaIterator } from 'redux-saga';
import { all, apply } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';

import { getChatByIdDraftSelector } from '@store/chats/selectors';

import { IChatsState } from '../../chats-state';
import { removeUploadingAttachment } from '../../upload-qeue';

import { IRemoveAllAttachmentsActionPayload } from './action-payloads/remove-all-attachments-action-payload';

export class RemoveAllAttachments {
  static get action() {
    return createAction('REMOVE_ALL_ATTACHMENTS')<IRemoveAllAttachmentsActionPayload>();
  }

  static get reducer() {
    return produce((draft: IChatsState, { payload }: ReturnType<typeof RemoveAllAttachments.action>) => {
      if (draft.selectedChatId) {
        const chat = getChatByIdDraftSelector(draft.selectedChatId, draft);

        if (chat) {
          delete chat.draftMessages[payload.draftId]?.attachmentsToSend;
        }
      }

      return draft;
    });
  }

  static get saga() {
    return function* removeAllAttachmentsSaga(
      action: ReturnType<typeof RemoveAllAttachments.action>,
    ): SagaIterator {
      yield all(
        action.payload.ids.map((id) =>
          apply(removeUploadingAttachment, removeUploadingAttachment, [id]),
        ),
      );
    };
  }
}
