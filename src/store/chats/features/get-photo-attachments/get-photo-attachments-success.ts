import { createAction } from '@reduxjs/toolkit';
import { IPictureAttachment } from 'kimbu-models';

import { IGroupable } from '@store/chats/models';

import { IChatsState } from '../../chats-state';
import { getChatByIdDraftSelector } from '../../selectors';

export interface IGetPhotoAttachmentsSuccessActionPayload {
  chatId: number;
  photos: (IPictureAttachment & IGroupable)[];
  hasMore: boolean;
}

export class GetPhotoAttachmentsSuccess {
  static get action() {
    return createAction<IGetPhotoAttachmentsSuccessActionPayload>(
      'GET_PHOTO_ATTACHMENTS_SUCCESS',
    );
  }

  static get reducer() {
    return (draft: IChatsState, { payload }: ReturnType<typeof GetPhotoAttachmentsSuccess.action>) => {
      const { photos, chatId, hasMore } = payload;

      const chat = getChatByIdDraftSelector(chatId, draft);

      if (chat) {
        chat.photos.data.push(...photos);
        chat.photos.hasMore = hasMore;
        chat.photos.loading = false;
      }
      return draft;
    };
  }
}
