import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { getChatArrayIndex } from '../../chats-utils';
import { ChatsState } from '../../models';
import { GetVideoAttachmentsSuccessActionPayload } from './get-video-attachments-success-action-payload';

export class GetVideoAttachmentsSuccess {
  static get action() {
    return createAction('GET_VIDEO_ATTACHMENTS_SUCCESS')<GetVideoAttachmentsSuccessActionPayload>();
  }

  static get reducer() {
    return produce((draft: ChatsState, { payload }: ReturnType<typeof GetVideoAttachmentsSuccess.action>) => {
      const { videos, chatId, hasMore } = payload;

      const chatIndex: number = getChatArrayIndex(chatId, draft);

      if (chatIndex >= 0) {
        draft.chats[chatIndex].videos.videos.push(...videos);
        draft.chats[chatIndex].videos.hasMore = hasMore;
      }
      return draft;
    });
  }
}
