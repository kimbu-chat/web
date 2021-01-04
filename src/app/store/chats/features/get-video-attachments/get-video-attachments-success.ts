import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { getChatByIdDraftSelector } from 'app/store/chats/selectors';
import { IChatsState } from '../../models';
import { IGetVideoAttachmentsSuccessActionPayload } from './get-video-attachments-success-action-payload';

export class GetVideoAttachmentsSuccess {
  static get action() {
    return createAction('GET_VIDEO_ATTACHMENTS_SUCCESS')<IGetVideoAttachmentsSuccessActionPayload>();
  }

  static get reducer() {
    return produce((draft: IChatsState, { payload }: ReturnType<typeof GetVideoAttachmentsSuccess.action>) => {
      const { videos, chatId, hasMore } = payload;

      const chat = getChatByIdDraftSelector(chatId, draft);

      if (chat) {
        chat.videos.videos.push(...videos);
        chat.videos.hasMore = hasMore;
        chat.videos.loading = false;
      }
      return draft;
    });
  }
}
