import { createAction } from '@reduxjs/toolkit';

import { IChatsState } from '../../chats-state';
import { getChatByIdDraftSelector } from '../../selectors';

export interface IGetChatInfoSuccessActionPayload {
  chatId: number;
  rawAttachmentsCount: number;
  voiceAttachmentsCount: number;
  videoAttachmentsCount: number;
  audioAttachmentsCount: number;
  pictureAttachmentsCount: number;
}


export class GetChatInfoSuccess {
  static get action() {
    return createAction<IGetChatInfoSuccessActionPayload>('GET_CHAT_INFO_SUCCESS');
  }

  static get reducer() {
    return (draft: IChatsState, { payload }: ReturnType<typeof GetChatInfoSuccess.action>) => {
        const {
          chatId,
          rawAttachmentsCount,
          voiceAttachmentsCount,
          videoAttachmentsCount,
          audioAttachmentsCount,
          pictureAttachmentsCount,
        } = payload;

        const chat = getChatByIdDraftSelector(chatId, draft);

        if (chat) {
          chat.rawAttachmentsCount = rawAttachmentsCount;
          chat.voiceAttachmentsCount = voiceAttachmentsCount;
          chat.videoAttachmentsCount = videoAttachmentsCount;
          chat.audioAttachmentsCount = audioAttachmentsCount;
          chat.pictureAttachmentsCount = pictureAttachmentsCount;
        }
        return draft;
      };
  }
}
