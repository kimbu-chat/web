import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { IFriendsState } from '../../models';
import { IDeleteFriendSuccessActionPayload } from './delete-friend-success-action-payload';

export class DeleteFriendSuccess {
  static get action() {
    return createAction('DELETE_FRIEND_SUCCESS')<IDeleteFriendSuccessActionPayload>();
  }

  static get reducer() {
    return produce((draft: IFriendsState, { payload }: ReturnType<typeof DeleteFriendSuccess.action>) => {
      payload.userIds.forEach((userId) => {
        draft.friends = draft.friends.filter(({ id }) => id !== userId);
      });

      return draft;
    });
  }
}
