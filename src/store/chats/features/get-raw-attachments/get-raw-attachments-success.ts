import { createAction } from '@reduxjs/toolkit';
import { IAttachmentBase } from 'kimbu-models';

import { IGroupable } from '@store/chats/models';

import { IChatsState } from '../../chats-state';
import { getChatByIdDraftSelector } from '../../selectors';

export interface IGetRawAttachmentsSuccessActionPayload {
  chatId: number;
  files: (IAttachmentBase & IGroupable)[];
  hasMore: boolean;
}


export class GetRawAttachmentsSuccess {
  static get action() {
    return createAction<IGetRawAttachmentsSuccessActionPayload>('GET_RAW_ATTACHMENTS_SUCCESS');
  }

  static get reducer() {
    return (draft: IChatsState, { payload }: ReturnType<typeof GetRawAttachmentsSuccess.action>) => {
        const { files, chatId, hasMore } = payload;

        const chat = getChatByIdDraftSelector(chatId, draft);

        if (chat) {
          chat.files.data.push(...files);
          chat.files.hasMore = hasMore;
          chat.files.loading = false;
        }
        return draft;
      };
  }
}
