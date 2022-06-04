import { createAction } from '@reduxjs/toolkit';

import { IFriendsState } from '../../friends-state';

export class DeleteFriendSuccess {
  static get action() {
    return createAction<number>('DELETE_FRIEND_SUCCESS');
  }

  static get reducer() {
    return (draft: IFriendsState, { payload }: ReturnType<typeof DeleteFriendSuccess.action>) => {
        const userId = payload;
        draft.friends.friendIds = draft.friends.friendIds.filter((id) => id !== userId);
        draft.searchFriends.friendIds = draft.searchFriends.friendIds.filter((id) => id !== userId);

        return draft;
      };
  }
}
