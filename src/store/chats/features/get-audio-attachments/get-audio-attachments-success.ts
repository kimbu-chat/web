import produce from 'immer';
import { createAction } from 'typesafe-actions';

import { IChatsState } from '../../chats-state';
import { getChatByIdDraftSelector } from '../../selectors';

import { IGetAudioAttachmentsSuccessActionPayload } from './action-payloads/get-audio-attachments-success-action-payload';

export class GetAudioAttachmentsSuccess {
  static get action() {
    return createAction(
      'GET_AUDIO_ATTACHMENTS_SUCCESS',
    )<IGetAudioAttachmentsSuccessActionPayload>();
  }

  static get reducer() {
    return produce(
      (draft: IChatsState, { payload }: ReturnType<typeof GetAudioAttachmentsSuccess.action>) => {
        const { audios, chatId, hasMore } = payload;

        const chat = getChatByIdDraftSelector(chatId, draft);

        if (chat) {
          chat.audios.audios.push(...audios);
          chat.audios.hasMore = hasMore;
          chat.audios.loading = false;
        }
        return draft;
      },
    );
  }
}
