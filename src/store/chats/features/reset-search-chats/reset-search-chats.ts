import { IChatsState } from '@store/chats/chats-state';
import { createEmptyAction } from '@store/common/actions';
import produce from 'immer';

export class ResetSearchChats {
  static get action() {
    return createEmptyAction('RESET_SEARCH_CHATS');
  }

  static get reducer() {
    return produce((draft: IChatsState) => {
      draft.searchChats.chats = [];
      draft.searchChats.hasMore = true;
      draft.searchChats.loading = false;

      return draft;
    });
  }
}
