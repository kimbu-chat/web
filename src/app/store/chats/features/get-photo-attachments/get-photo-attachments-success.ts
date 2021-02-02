import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { getChatByIdDraftSelector } from 'app/store/chats/selectors';
import { IGetPhotoAttachmentsSuccessActionPayload } from './action-payloads/get-photo-attachments-success-action-payload';
import { IChatsState } from '../../chats-state';

export class GetPhotoAttachmentsSuccess {
  static get action() {
    return createAction('GET_PHOTO_ATTACHMENTS_SUCCESS')<IGetPhotoAttachmentsSuccessActionPayload>();
  }

  static get reducer() {
    return produce((draft: IChatsState, { payload }: ReturnType<typeof GetPhotoAttachmentsSuccess.action>) => {
      const { photos, chatId, hasMore } = payload;

      const chat = getChatByIdDraftSelector(chatId, draft);

      if (chat) {
        chat.photos.photos.push(...photos);
        chat.photos.hasMore = hasMore;
        chat.photos.loading = false;
      }
      return draft;
    });
  }
}
