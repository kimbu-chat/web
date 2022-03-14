import produce from 'immer';
import { createAction } from 'typesafe-actions';

import {IAttachmentToSend} from '@store/chats/models';

import { IChatsState } from '../../chats-state';
import { getChatByIdDraftSelector } from '../../selectors';

import { IUploadAttachmentProgressActionPayload } from './action-payloads/upload-attachment-progress-action-payload';

export class UploadAttachmentProgress {
  static get action() {
    return createAction('UPLOAD_ATTACHMENT_PROGRESS')<IUploadAttachmentProgressActionPayload>();
  }

  static get reducer() {
    return produce(
      (draft: IChatsState, { payload }: ReturnType<typeof UploadAttachmentProgress.action>) => {
        const { progress, chatId, attachmentId, uploadedBytes, draftId } = payload;

        const chat = getChatByIdDraftSelector(chatId, draft);

        if (chat) {
          if (!chat.messages.messages[draftId].attachments) {
            return draft;
          }

          const currentAttachment = chat.messages.messages[draftId].attachments?.find(
            (attachment) => attachment.id === attachmentId,
          ) as IAttachmentToSend;

          if (currentAttachment) {
            currentAttachment.progress = progress;
            currentAttachment.uploadedBytes = uploadedBytes;
          }
        }
        return draft;
      },
    );
  }
}
