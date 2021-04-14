import { createEmptyAction } from '@store/common/actions';
import { IFriendsState } from '@store/friends/friends-state';
import produce from 'immer';

export class ResetSearchFriends {
  static get action() {
    return createEmptyAction('RESET_SEARCH_FRIENDS');
  }

  static get reducer() {
    return produce((draft: IFriendsState) => {
      draft.searchFriends.friends = [];
      draft.searchFriends.hasMore = true;
      draft.searchFriends.loading = false;

      return draft;
    });
  }
}
