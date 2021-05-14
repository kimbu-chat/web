import produce from 'immer';

import { IChatsState } from '@store/chats/chats-state';
import { createEmptyAction } from '@store/common/actions';

export class ResetSearchChats {
  static get action() {
    return createEmptyAction('RESET_SEARCH_CHATS');
  }

  static get reducer() {
    return produce((draft: IChatsState) => {
      draft.searchChatList.chatIds = [];
      draft.searchChatList.hasMore = true;
      draft.searchChatList.loading = false;

      return draft;
    });
  }
}
