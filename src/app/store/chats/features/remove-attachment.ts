import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { getChatArrayIndex } from '../chats-utils';
import { RemoveAttachmentReqData, ChatsState } from '../models';

export class RemoveAttachment {
  static get action() {
    return createAction('REMOVE_ATTACHMENT')<RemoveAttachmentReqData>();
  }

  static get reducer() {
    return produce((draft: ChatsState, { payload }: ReturnType<typeof RemoveAttachment.action>) => {
      const { chatId, attachmentId } = payload;

      const chatIndex: number = getChatArrayIndex(chatId, draft);

      if (chatIndex >= 0) {
        if (!draft.chats[chatIndex].attachmentsToSend) {
          return draft;
        }

        draft.chats[chatIndex].attachmentsToSend = draft.chats[chatIndex].attachmentsToSend?.filter(({ attachment }) => attachment.id !== attachmentId);
      }

      return draft;
    });
  }
}
