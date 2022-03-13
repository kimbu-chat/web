import produce from 'immer';
import { createAction } from 'typesafe-actions';

import {IAttachmentToSend} from '@store/chats/models';

import { IChatsState } from '../../chats-state';
import { getChatByIdDraftSelector } from '../../selectors';

import { IUploadAttachmentFailureActionPayload } from './action-payloads/upload-attachment-failure-action-payload';

export class UploadAttachmentFailure {
  static get action() {
    return createAction('UPLOAD_ATTACHMENT_FAILURE')<IUploadAttachmentFailureActionPayload>();
  }

  static get reducer() {
    return produce(
      (draft: IChatsState, { payload }: ReturnType<typeof UploadAttachmentFailure.action>) => {
        const { chatId, attachmentId } = payload;

        const chat = getChatByIdDraftSelector(chatId, draft);

        if (chat && chat.draftMessageId) {
          const currentAttachment = chat.messages.messages[chat.draftMessageId].attachments.find(
            (attachment) => attachment.id === attachmentId,
          ) as IAttachmentToSend;

          if (currentAttachment) {
            currentAttachment.success = false;
            currentAttachment.failure = true;
          }
        }
        return draft;
      },
    );
  }
}
