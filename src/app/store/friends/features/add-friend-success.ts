import { UserPreview } from 'app/store/my-profile/models';
import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { FriendsState } from '../models';

export class AddFriendSuccess {
  static get action() {
    return createAction('ADD_FRIEND_SUCCESS')<UserPreview>();
  }

  static get reducer() {
    return produce((draft: FriendsState, { payload }: ReturnType<typeof AddFriendSuccess.action>) => {
      draft.friends.push(payload);
      return draft;
    });
  }
}
