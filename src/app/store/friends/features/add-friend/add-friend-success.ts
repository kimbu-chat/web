import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { FriendsState } from '../../models';
import { AddFriendSuccessActionPayload } from './add-friend-success-action-payload';

export class AddFriendSuccess {
  static get action() {
    return createAction('ADD_FRIEND_SUCCESS')<AddFriendSuccessActionPayload>();
  }

  static get reducer() {
    return produce((draft: FriendsState, { payload }: ReturnType<typeof AddFriendSuccess.action>) => {
      draft.friends.push(payload);
      return draft;
    });
  }
}
