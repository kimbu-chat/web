import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { getChatArrayIndex } from '../chats-utils';
import { GetAudioAttachmentsResponse, ChatsState } from '../models';

export class GetAudioAttachmentsSuccess {
  static get action() {
    return createAction('GET_AUDIO_ATTACHMENTS_SUCCESS')<GetAudioAttachmentsResponse>();
  }

  static get reducer() {
    return produce((draft: ChatsState, { payload }: ReturnType<typeof GetAudioAttachmentsSuccess.action>) => {
      const { audios, chatId, hasMore } = payload;

      const chatIndex: number = getChatArrayIndex(chatId, draft);

      if (chatIndex >= 0) {
        draft.chats[chatIndex].audios.audios.push(...audios);
        draft.chats[chatIndex].audios.hasMore = hasMore;
      }
      return draft;
    });
  }
}
