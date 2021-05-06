import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { IFriendsState } from '../../friends-state';

export class DeleteFriendSuccess {
  static get action() {
    return createAction('DELETE_FRIEND_SUCCESS')<number>();
  }

  static get reducer() {
    return produce(
      (draft: IFriendsState, { payload }: ReturnType<typeof DeleteFriendSuccess.action>) => {
        const userId = payload;
        draft.friends.friendIds = draft.friends.friendIds.filter((id) => id !== userId);
        draft.searchFriends.friendIds = draft.searchFriends.friendIds.filter((id) => id !== userId);

        return draft;
      },
    );
  }
}
