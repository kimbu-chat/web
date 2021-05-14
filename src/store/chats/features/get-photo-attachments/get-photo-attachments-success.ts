import produce from 'immer';
import { createAction } from 'typesafe-actions';

import { getChatByIdDraftSelector } from '../../selectors';
import { IChatsState } from '../../chats-state';

import { IGetPhotoAttachmentsSuccessActionPayload } from './action-payloads/get-photo-attachments-success-action-payload';

export class GetPhotoAttachmentsSuccess {
  static get action() {
    return createAction(
      'GET_PHOTO_ATTACHMENTS_SUCCESS',
    )<IGetPhotoAttachmentsSuccessActionPayload>();
  }

  static get reducer() {
    return produce(
      (draft: IChatsState, { payload }: ReturnType<typeof GetPhotoAttachmentsSuccess.action>) => {
        const { photos, chatId, hasMore } = payload;

        const chat = getChatByIdDraftSelector(chatId, draft);

        if (chat) {
          chat.photos.photos.push(...photos);
          chat.photos.hasMore = hasMore;
          chat.photos.loading = false;
        }
        return draft;
      },
    );
  }
}
