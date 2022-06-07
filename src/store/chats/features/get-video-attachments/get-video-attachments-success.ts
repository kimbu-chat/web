import { createAction } from '@reduxjs/toolkit';
import { IVideoAttachment } from 'kimbu-models';

import { IGroupable } from '@store/chats/models';

import { IChatsState } from '../../chats-state';
import { getChatByIdDraftSelector } from '../../selectors';

export interface IGetVideoAttachmentsSuccessActionPayload {
  chatId: number;
  videos: (IVideoAttachment & IGroupable)[];
  hasMore: boolean;
}

export class GetVideoAttachmentsSuccess {
  static get action() {
    return createAction<IGetVideoAttachmentsSuccessActionPayload>(
      'GET_VIDEO_ATTACHMENTS_SUCCESS',
    );
  }

  static get reducer() {
    return (draft: IChatsState, { payload }: ReturnType<typeof GetVideoAttachmentsSuccess.action>) => {
      const { videos, chatId, hasMore } = payload;

      const chat = getChatByIdDraftSelector(chatId, draft);

      if (chat) {
        chat.videos.data.push(...videos);
        chat.videos.hasMore = hasMore;
        chat.videos.loading = false;
      }
      return draft;
    };
  }
}
