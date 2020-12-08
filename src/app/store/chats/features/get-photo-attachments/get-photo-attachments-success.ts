import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { getChatArrayIndex } from '../../chats-utils';
import { ChatsState } from '../../models';
import { GetPhotoAttachmentsSuccessActionPayload } from './get-photo-attachments-success-action-payload';

export class GetPhotoAttachmentsSuccess {
  static get action() {
    return createAction('GET_PHOTO_ATTACHMENTS_SUCCESS')<GetPhotoAttachmentsSuccessActionPayload>();
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
