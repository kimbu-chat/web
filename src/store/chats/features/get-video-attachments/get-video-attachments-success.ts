import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { getChatByIdDraftSelector } from '../../selectors';
import { IGetVideoAttachmentsSuccessActionPayload } from './action-payloads/get-video-attachments-success-action-payload';
import { IChatsState } from '../../chats-state';

export class GetVideoAttachmentsSuccess {
  static get action() {
    return createAction(
      'GET_VIDEO_ATTACHMENTS_SUCCESS',
    )<IGetVideoAttachmentsSuccessActionPayload>();
  }

  static get reducer() {
    return produce(
      (draft: IChatsState, { payload }: ReturnType<typeof GetVideoAttachmentsSuccess.action>) => {
        const { videos, chatId, hasMore } = payload;

        const chat = getChatByIdDraftSelector(chatId, draft);

        if (chat) {
          chat.videos.videos.push(...videos);
          chat.videos.hasMore = hasMore;
          chat.videos.loading = false;
        }
        return draft;
      },
    );
  }
}
