import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { IFriendsState } from '../../models';
import { IAddFriendSuccessActionPayload } from './add-friend-success-action-payload';

export class AddFriendSuccess {
  static get action() {
    return createAction('ADD_FRIEND_SUCCESS')<IAddFriendSuccessActionPayload>();
  }

  static get reducer() {
    return produce((draft: IFriendsState, { payload }: ReturnType<typeof AddFriendSuccess.action>) => {
      draft.friends.push(payload);
      return draft;
    });
  }
}
