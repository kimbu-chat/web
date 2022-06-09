import { createAction } from '@reduxjs/toolkit';

import { IFriendsState } from '@store/friends/friends-state';

export class ResetSearchFriends {
  static get action() {
    return createAction('RESET_SEARCH_FRIENDS');
  }

  static get reducer() {
    return (draft: IFriendsState) => {
      draft.searchFriends.friendIds = [];
      draft.searchFriends.hasMore = true;
      draft.searchFriends.loading = false;

      return draft;
    };
  }
}
