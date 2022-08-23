import { createAction } from '@reduxjs/toolkit';
import { SagaIterator } from 'redux-saga';
import { apply, put, select } from 'redux-saga/effects';

import { INormalizedChat } from '@store/chats/models';

import { IChatsState } from '../../chats-state';
import { getChatByIdDraftSelector, getChatByIdSelector, getMessageSelector, getSelectedChatIdSelector } from '../../selectors';
import { removeUploadingAttachment } from '../../upload-qeue';
import { DeleteMessageSuccess } from '../delete-message/delete-message-success';

export interface IRemoveAttachmentActionPayload {
  attachmentId: number;
  messageId?: number;
}

export class RemoveAttachment {
  static get action() {
    return createAction<IRemoveAttachmentActionPayload>('REMOVE_ATTACHMENT');
  }

  static get reducer() {
    return (draft: IChatsState, { payload }: ReturnType<typeof RemoveAttachment.action>) => {
      const { attachmentId, messageId } = payload;

      const filterDeletedAttachment = (attachId: number, messageItemId: number, chat: INormalizedChat) => {
        const draftAttachments = chat.messages.messages[messageItemId].attachments;

        // eslint-disable-next-line no-param-reassign
        chat.messages.messages[messageItemId].attachments = draftAttachments.filter((attachment) => attachment.id !== attachId);
      };

      if (draft.selectedChatId) {
        const chat = getChatByIdDraftSelector(draft.selectedChatId, draft);

        if (chat && messageId) {
          filterDeletedAttachment(attachmentId, messageId, chat);
          return draft;
        }

        if (chat && chat.draftMessageId) {
          filterDeletedAttachment(attachmentId, chat.draftMessageId, chat);
        }
      }

      return draft;
    };
  }

  static get saga() {
    return function* removeAttachment(action: ReturnType<typeof RemoveAttachment.action>): SagaIterator {
      const { attachmentId, messageId } = action.payload;

      const selectedChatId: number = yield select(getSelectedChatIdSelector);
      const chat = yield select(getChatByIdSelector(selectedChatId));
      const message = yield select(getMessageSelector(selectedChatId, messageId as number));

      if (!message.text && !message.attachments.length) {
        yield put(DeleteMessageSuccess.action({ messageIds: [message.id], chatId: chat.id }));
      }

      yield apply(removeUploadingAttachment, removeUploadingAttachment, [attachmentId]);
    };
  }
}
