import { createAction } from '@reduxjs/toolkit';

import { IFriendsState } from '../../friends-state';

export class AddFriendSuccess {
  static get action() {
    return createAction<number>('ADD_FRIEND_SUCCESS');
  }

  static get reducer() {
    return (draft: IFriendsState, { payload }: ReturnType<typeof AddFriendSuccess.action>) => {
      const { friendIds } = draft.friends;
      if (!friendIds.some((id) => id === payload)) {
        friendIds.push(payload);
      }
      return draft;
    };
  }
}
