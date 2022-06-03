import { createAction } from '@reduxjs/toolkit';
import { IAudioAttachment } from 'kimbu-models';

import { IGroupable } from '@store/chats/models';

import { IChatsState } from '../../chats-state';
import { getChatByIdDraftSelector } from '../../selectors';

export interface IGetAudioAttachmentsSuccessActionPayload {
  chatId: number;
  audios: (IAudioAttachment & IGroupable)[];
  hasMore: boolean;
}

export class GetAudioAttachmentsSuccess {
  static get action() {
    return createAction<IGetAudioAttachmentsSuccessActionPayload>(
      'GET_AUDIO_ATTACHMENTS_SUCCESS',
    );
  }

  static get reducer() {
    return (draft: IChatsState, { payload }: ReturnType<typeof GetAudioAttachmentsSuccess.action>) => {
        const { audios, chatId, hasMore } = payload;

        const chat = getChatByIdDraftSelector(chatId, draft);

        if (chat) {
          chat.audios.data.push(...audios);
          chat.audios.hasMore = hasMore;
          chat.audios.loading = false;
        }
        return draft;
      };
  }
}
