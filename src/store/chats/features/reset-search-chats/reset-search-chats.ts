import { createAction } from '@reduxjs/toolkit';

import { IChatsState } from '@store/chats/chats-state';

export class ResetSearchChats {
  static get action() {
    return createAction('RESET_SEARCH_CHATS');
  }

  static get reducer() {
    return (draft: IChatsState) => {
      draft.searchChatList.chatIds = [];
      draft.searchChatList.hasMore = true;
      draft.searchChatList.loading = false;

      return draft;
    };
  }
}
