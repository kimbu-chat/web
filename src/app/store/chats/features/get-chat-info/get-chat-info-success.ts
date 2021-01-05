import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { getChatByIdDraftSelector } from 'app/store/chats/selectors';
import { IChatsState } from '../../models';
import { IGetChatInfoSuccessActionPayload } from './action-payloads/get-chat-info-success-action-payload';

export class GetChatInfoSuccess {
  static get action() {
    return createAction('GET_CHAT_INFO_SUCCESS')<IGetChatInfoSuccessActionPayload>();
  }

  static get reducer() {
    return produce((draft: IChatsState, { payload }: ReturnType<typeof GetChatInfoSuccess.action>) => {
      const { chatId, rawAttachmentsCount, voiceAttachmentsCount, videoAttachmentsCount, audioAttachmentsCount, pictureAttachmentsCount } = payload;

      const chat = getChatByIdDraftSelector(chatId, draft);

      if (chat) {
        chat.rawAttachmentsCount = rawAttachmentsCount;
        chat.voiceAttachmentsCount = voiceAttachmentsCount;
        chat.videoAttachmentsCount = videoAttachmentsCount;
        chat.audioAttachmentsCount = audioAttachmentsCount;
        chat.pictureAttachmentsCount = pictureAttachmentsCount;
      }
      return draft;
    });
  }
}
