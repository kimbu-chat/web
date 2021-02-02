import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { getChatByIdDraftSelector } from 'app/store/chats/selectors';
import { IGetRawAttachmentsSuccessActionPayload } from './action-payloads/get-raw-attachments-success-action-payload';
import { IChatsState } from '../../chats-state';

export class GetRawAttachmentsSuccess {
  static get action() {
    return createAction('GET_RAW_ATTACHMENTS_SUCCESS')<IGetRawAttachmentsSuccessActionPayload>();
  }

  static get reducer() {
    return produce((draft: IChatsState, { payload }: ReturnType<typeof GetRawAttachmentsSuccess.action>) => {
      const { files, chatId, hasMore } = payload;

      const chat = getChatByIdDraftSelector(chatId, draft);

      if (chat) {
        chat.files.files.push(...files);
        chat.files.hasMore = hasMore;
        chat.files.loading = false;
      }
      return draft;
    });
  }
}
