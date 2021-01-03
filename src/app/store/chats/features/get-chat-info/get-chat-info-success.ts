import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { getChatListChatIndex } from 'app/store/chats/selectors';
import { IChatsState } from '../../models';
import { IGetChatInfoSuccessActionPayload } from './get-chat-info-success-action-payload';

export class GetChatInfoSuccess {
  static get action() {
    return createAction('GET_CHAT_INFO_SUCCESS')<IGetChatInfoSuccessActionPayload>();
  }

  static get reducer() {
    return produce((draft: IChatsState, { payload }: ReturnType<typeof GetChatInfoSuccess.action>) => {
      const { chatId, rawAttachmentsCount, voiceAttachmentsCount, videoAttachmentsCount, audioAttachmentsCount, pictureAttachmentsCount } = payload;

      const chatIndex: number = getChatListChatIndex(chatId, draft);

      if (chatIndex >= 0) {
        draft.chats[chatIndex].rawAttachmentsCount = rawAttachmentsCount;
        draft.chats[chatIndex].voiceAttachmentsCount = voiceAttachmentsCount;
        draft.chats[chatIndex].videoAttachmentsCount = videoAttachmentsCount;
        draft.chats[chatIndex].audioAttachmentsCount = audioAttachmentsCount;
        draft.chats[chatIndex].pictureAttachmentsCount = pictureAttachmentsCount;
      }
      return draft;
    });
  }
}
