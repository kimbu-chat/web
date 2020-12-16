import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { getChatArrayIndex } from 'app/store/chats/selectors';
import { GetVoiceAttachmentsSuccessActionPayload } from './get-voice-attachments-success-action-payload';
import { ChatsState } from '../../models';

export class GetVoiceAttachmentsSuccess {
  static get action() {
    return createAction('GET_VOICE_ATTACHMENTS_SUCCESS')<GetVoiceAttachmentsSuccessActionPayload>();
  }

  static get reducer() {
    return produce((draft: ChatsState, { payload }: ReturnType<typeof GetVoiceAttachmentsSuccess.action>) => {
      const { recordings, chatId, hasMore } = payload;

      const chatIndex: number = getChatArrayIndex(chatId, draft);

      if (chatIndex >= 0) {
        draft.chats[chatIndex].recordings.recordings.push(...recordings);
        draft.chats[chatIndex].recordings.hasMore = hasMore;
        draft.chats[chatIndex].recordings.loading = false;
      }
      return draft;
    });
  }
}
