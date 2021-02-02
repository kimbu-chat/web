import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { getChatByIdDraftSelector } from 'app/store/chats/selectors';
import { IGetAudioAttachmentsSuccessActionPayload } from './action-payloads/get-audio-attachments-success-action-payload';
import { IChatsState } from '../../chats-state';

export class GetAudioAttachmentsSuccess {
  static get action() {
    return createAction('GET_AUDIO_ATTACHMENTS_SUCCESS')<IGetAudioAttachmentsSuccessActionPayload>();
  }

  static get reducer() {
    return produce((draft: IChatsState, { payload }: ReturnType<typeof GetAudioAttachmentsSuccess.action>) => {
      const { audios, chatId, hasMore } = payload;

      const chat = getChatByIdDraftSelector(chatId, draft);

      if (chat) {
        chat.audios.audios.push(...audios);
        chat.audios.hasMore = hasMore;
        chat.audios.loading = false;
      }
      return draft;
    });
  }
}
