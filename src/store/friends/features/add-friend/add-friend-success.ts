import produce from 'immer';
import { createAction } from 'typesafe-actions';

import { IFriendsState } from '../../friends-state';

export class AddFriendSuccess {
  static get action() {
    return createAction('ADD_FRIEND_SUCCESS')<string>();
  }

  static get reducer() {
    return produce(
      (draft: IFriendsState, { payload }: ReturnType<typeof AddFriendSuccess.action>) => {
        draft.friends.friendIds.push(payload);
        return draft;
      },
    );
  }
}
