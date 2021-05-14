import produce from 'immer';

import { createEmptyAction } from '@store/common/actions';
import { IFriendsState } from '@store/friends/friends-state';

export class ResetSearchFriends {
  static get action() {
    return createEmptyAction('RESET_SEARCH_FRIENDS');
  }

  static get reducer() {
    return produce((draft: IFriendsState) => {
      draft.searchFriends.friendIds = [];
      draft.searchFriends.hasMore = true;
      draft.searchFriends.loading = false;

      return draft;
    });
  }
}
