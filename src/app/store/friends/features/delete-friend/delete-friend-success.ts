import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { DeleteFriendsActionData, FriendsState } from '../../models';

export class DeleteFriendSuccess {
  static get action() {
    return createAction('DELETE_FRIEND_SUCCESS')<DeleteFriendsActionData>();
  }

  static get reducer() {
    return produce((draft: FriendsState, { payload }: ReturnType<typeof DeleteFriendSuccess.action>) => {
      payload.userIds.forEach((userId) => {
        draft.friends = draft.friends.filter(({ id }) => id !== userId);
      });

      return draft;
    });
  }
}
