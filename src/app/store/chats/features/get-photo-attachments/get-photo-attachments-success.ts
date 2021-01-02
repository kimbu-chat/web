import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { getChatListChatIndex } from 'app/store/chats/selectors';
import { IChatsState } from '../../models';
import { IGetPhotoAttachmentsSuccessActionPayload } from './get-photo-attachments-success-action-payload';

export class GetPhotoAttachmentsSuccess {
  static get action() {
    return createAction('GET_PHOTO_ATTACHMENTS_SUCCESS')<IGetPhotoAttachmentsSuccessActionPayload>();
  }

  static get reducer() {
    return produce((draft: IChatsState, { payload }: ReturnType<typeof GetPhotoAttachmentsSuccess.action>) => {
      const { photos, chatId, hasMore } = payload;

      const chatIndex: number = getChatListChatIndex(chatId, draft);

      if (chatIndex >= 0) {
        draft.chats[chatIndex].photos.photos.push(...photos);
        draft.chats[chatIndex].photos.hasMore = hasMore;
        draft.chats[chatIndex].photos.loading = false;
      }
      return draft;
    });
  }
}
