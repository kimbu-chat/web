import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { getChatArrayIndex } from '../../chats-utils';
import { ChatsState } from '../../models';
import { GetChatInfoSuccessActionPayload } from './get-chat-info-success-action-payload';

export class GetChatInfoSuccess {
  static get action() {
    return createAction('GET_CHAT_INFO_SUCCESS')<GetChatInfoSuccessActionPayload>();
  }

  static get reducer() {
    return produce((draft: ChatsState, { payload }: ReturnType<typeof GetChatInfoSuccess.action>) => {
      const { chatId, rawAttachmentsCount, voiceAttachmentsCount, videoAttachmentsCount, audioAttachmentsCount, pictureAttachmentsCount } = payload;

      const chatIndex: number = getChatArrayIndex(chatId, draft);

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
