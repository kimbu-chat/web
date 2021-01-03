import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { getChatListChatIndex } from 'app/store/chats/selectors';
import { IGetVoiceAttachmentsSuccessActionPayload } from './get-voice-attachments-success-action-payload';
import { IChatsState } from '../../models';

export class GetVoiceAttachmentsSuccess {
  static get action() {
    return createAction('GET_VOICE_ATTACHMENTS_SUCCESS')<IGetVoiceAttachmentsSuccessActionPayload>();
  }

  static get reducer() {
    return produce((draft: IChatsState, { payload }: ReturnType<typeof GetVoiceAttachmentsSuccess.action>) => {
      const { recordings, chatId, hasMore } = payload;

      const chatIndex: number = getChatListChatIndex(chatId, draft);

      if (chatIndex >= 0) {
        draft.chats[chatIndex].recordings.recordings.push(...recordings);
        draft.chats[chatIndex].recordings.hasMore = hasMore;
        draft.chats[chatIndex].recordings.loading = false;
      }
      return draft;
    });
  }
}
