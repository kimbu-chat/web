import { createAction } from '@reduxjs/toolkit';

import { IChatsState } from '../../chats-state';

export class GetChatsFailure {
  static get action() {
    return createAction('GET_CHATS_FAILURE');
  }

  static get reducer() {
    return (draft: IChatsState) => {
      draft.chatList.loading = false;
      draft.searchChatList.loading = false;

      return draft;
    };
  }
}
