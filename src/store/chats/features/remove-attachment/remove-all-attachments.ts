import { createAction } from '@reduxjs/toolkit';
import { SagaIterator } from 'redux-saga';
import { all, apply } from 'redux-saga/effects';

import { getChatByIdDraftSelector } from '@store/chats/selectors';

import { IChatsState } from '../../chats-state';
import { removeUploadingAttachment } from '../../upload-qeue';

export interface IRemoveAllAttachmentsActionPayload {
  ids: number[];
}

export class RemoveAllAttachments {
  static get action() {
    return createAction<IRemoveAllAttachmentsActionPayload>('REMOVE_ALL_ATTACHMENTS');
  }

  static get reducer() {
    return (draft: IChatsState) => {
      if (draft.selectedChatId) {
        const chat = getChatByIdDraftSelector(draft.selectedChatId, draft);

        if (chat) {
          delete chat.attachmentsToSend;
        }
      }

      return draft;
    };
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
