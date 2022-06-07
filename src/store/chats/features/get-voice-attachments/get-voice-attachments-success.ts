import { createAction } from '@reduxjs/toolkit';
import { IVoiceAttachment } from 'kimbu-models';

import { IGroupable } from '@store/chats/models';

import { IChatsState } from '../../chats-state';
import { getChatByIdDraftSelector } from '../../selectors';

export interface IGetVoiceAttachmentsSuccessActionPayload {
  chatId: number;
  recordings: (IVoiceAttachment & IGroupable)[];
  hasMore: boolean;
}

export class GetVoiceAttachmentsSuccess {
  static get action() {
    return createAction<IGetVoiceAttachmentsSuccessActionPayload>(
      'GET_VOICE_ATTACHMENTS_SUCCESS',
    );
  }

  static get reducer() {
    return (draft: IChatsState, { payload }: ReturnType<typeof GetVoiceAttachmentsSuccess.action>) => {
      const { recordings, chatId, hasMore } = payload;

      const chat = getChatByIdDraftSelector(chatId, draft);

      if (chat) {
        chat.recordings.data.push(...recordings);
        chat.recordings.hasMore = hasMore;
        chat.recordings.loading = false;
      }

      return draft;
    };
  }
}
