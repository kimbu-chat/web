import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { getChatArrayIndex } from '../../chats-utils';
import { ChatsState } from '../../models';
import { GetRawAttachmentsSuccessActionPayload } from './get-raw-attachments-success-action-payload';

export class GetRawAttachmentsSuccess {
  static get action() {
    return createAction('GET_RAW_ATTACHMENTS_SUCCESS')<GetRawAttachmentsSuccessActionPayload>();
  }

  static get reducer() {
    return produce((draft: ChatsState, { payload }: ReturnType<typeof GetRawAttachmentsSuccess.action>) => {
      const { files, chatId, hasMore } = payload;

      const chatIndex: number = getChatArrayIndex(chatId, draft);

      if (chatIndex >= 0) {
        draft.chats[chatIndex].files.files.push(...files);
        draft.chats[chatIndex].files.hasMore = hasMore;
      }
      return draft;
    });
  }
}
