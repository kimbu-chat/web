import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { getChatListChatIndex } from 'app/store/chats/selectors';
import { IChatsState } from '../../models';
import { IGetRawAttachmentsSuccessActionPayload } from './get-raw-attachments-success-action-payload';

export class GetRawAttachmentsSuccess {
  static get action() {
    return createAction('GET_RAW_ATTACHMENTS_SUCCESS')<IGetRawAttachmentsSuccessActionPayload>();
  }

  static get reducer() {
    return produce((draft: IChatsState, { payload }: ReturnType<typeof GetRawAttachmentsSuccess.action>) => {
      const { files, chatId, hasMore } = payload;

      const chatIndex: number = getChatListChatIndex(chatId, draft);

      if (chatIndex >= 0) {
        draft.chats[chatIndex].files.files.push(...files);
        draft.chats[chatIndex].files.hasMore = hasMore;
        draft.chats[chatIndex].files.loading = false;
      }
      return draft;
    });
  }
}
