import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { IFriendsState } from '../../friends-state';
import { IDeleteFriendSuccessActionPayload } from './action-payloads/delete-friend-success-action-payload';

export class DeleteFriendSuccess {
  static get action() {
    return createAction('DELETE_FRIEND_SUCCESS')<IDeleteFriendSuccessActionPayload>();
  }

  static get reducer() {
    return produce(
      (draft: IFriendsState, { payload }: ReturnType<typeof DeleteFriendSuccess.action>) => {
        payload.userIds.forEach((userId) => {
          draft.friends.friendIds = draft.friends.friendIds.filter((id) => id !== userId);
          draft.searchFriends.friendIds = draft.searchFriends.friendIds.filter(
            (id) => id !== userId,
          );

          return draft;
        });
      },
    );
  }
}
