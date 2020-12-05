import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { getChatArrayIndex } from '../../chats-utils';
import { GetPhotoAttachmentsResponse, ChatsState } from '../../models';

export class GetPhotoAttachmentsSuccess {
  static get action() {
    return createAction('GET_PHOTO_ATTACHMENTS_SUCCESS')<GetPhotoAttachmentsResponse>();
  }

  static get reducer() {
    return produce((draft: ChatsState, { payload }: ReturnType<typeof GetPhotoAttachmentsSuccess.action>) => {
      const { photos, chatId, hasMore } = payload;

      const chatIndex: number = getChatArrayIndex(chatId, draft);

      if (chatIndex >= 0) {
        draft.chats[chatIndex].photos.photos.push(...photos);
        draft.chats[chatIndex].photos.hasMore = hasMore;
      }
      return draft;
    });
  }
}
