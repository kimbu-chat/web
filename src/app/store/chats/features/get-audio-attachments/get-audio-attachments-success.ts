import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { getChatArrayIndex } from 'app/store/chats/selectors';
import { IChatsState } from '../../models';
import { IGetAudioAttachmentsSuccessActionPayload } from './get-audio-attachments-success-action-payload';

export class GetAudioAttachmentsSuccess {
  static get action() {
    return createAction('GET_AUDIO_ATTACHMENTS_SUCCESS')<IGetAudioAttachmentsSuccessActionPayload>();
  }

  static get reducer() {
    return produce((draft: IChatsState, { payload }: ReturnType<typeof GetAudioAttachmentsSuccess.action>) => {
      const { audios, chatId, hasMore } = payload;

      const chatIndex: number = getChatArrayIndex(chatId, draft);

      if (chatIndex >= 0) {
        draft.chats[chatIndex].audios.audios.push(...audios);
        draft.chats[chatIndex].audios.hasMore = hasMore;
        draft.chats[chatIndex].audios.loading = false;
      }
      return draft;
    });
  }
}
