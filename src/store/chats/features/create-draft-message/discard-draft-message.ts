import { createAction } from '@reduxjs/toolkit';

import { IChatsState } from '../../chats-state';

export class DiscardDraftMessage {
  static get action() {
    return createAction<number>('DISCARD_DRAFT_MESSAGE');
  }

  static get reducer() {
    return (
      draft: IChatsState,
      { payload: chatId }: ReturnType<typeof DiscardDraftMessage.action>,
    ) => {
      const chat = draft.chats[chatId];
      chat.draftMessageId = undefined;

      return draft;
    };
  }
}
