import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { getChatListChatIndex } from 'app/store/chats/selectors';
import { IChatsState } from '../../models';
import { IGetVideoAttachmentsSuccessActionPayload } from './get-video-attachments-success-action-payload';

export class GetVideoAttachmentsSuccess {
  static get action() {
    return createAction('GET_VIDEO_ATTACHMENTS_SUCCESS')<IGetVideoAttachmentsSuccessActionPayload>();
  }

  static get reducer() {
    return produce((draft: IChatsState, { payload }: ReturnType<typeof GetVideoAttachmentsSuccess.action>) => {
      const { videos, chatId, hasMore } = payload;

      const chatIndex: number = getChatListChatIndex(chatId, draft);

      if (chatIndex >= 0) {
        draft.chats[chatIndex].videos.videos.push(...videos);
        draft.chats[chatIndex].videos.hasMore = hasMore;
        draft.chats[chatIndex].videos.loading = false;
      }
      return draft;
    });
  }
}
