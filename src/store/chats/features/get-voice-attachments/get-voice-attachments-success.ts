import produce from 'immer';
import { createAction } from 'typesafe-actions';

import { IChatsState } from '../../chats-state';
import { getChatByIdDraftSelector } from '../../selectors';

import { IGetVoiceAttachmentsSuccessActionPayload } from './action-payloads/get-voice-attachments-success-action-payload';

export class GetVoiceAttachmentsSuccess {
  static get action() {
    return createAction(
      'GET_VOICE_ATTACHMENTS_SUCCESS',
    )<IGetVoiceAttachmentsSuccessActionPayload>();
  }

  static get reducer() {
    return produce(
      (draft: IChatsState, { payload }: ReturnType<typeof GetVoiceAttachmentsSuccess.action>) => {
        const { recordings, chatId, hasMore } = payload;

        const chat = getChatByIdDraftSelector(chatId, draft);

        if (chat) {
          chat.recordings.data.push(...recordings);
          chat.recordings.hasMore = hasMore;
          chat.recordings.loading = false;
        }

        return draft;
      },
    );
  }
}
