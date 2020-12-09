import produce from 'immer';
import { unionBy } from 'lodash';
import { createAction } from 'typesafe-actions';
import { GetFriendsSuccessActionPayload } from './get-friends-success-action-payload';
import { FriendsState } from '../../models';

export class GetFriendsSuccess {
  static get action() {
    return createAction('GET_FRIENDS_SUCCESS')<GetFriendsSuccessActionPayload>();
  }

  static get reducer() {
    return produce((draft: FriendsState, { payload }: ReturnType<typeof GetFriendsSuccess.action>) => {
      const { users, hasMore, initializedBySearch } = payload;

      draft.hasMoreFriends = hasMore;

      if (initializedBySearch) {
        draft.loading = false;
        draft.friends = users;

        return draft;
      }

      draft.friends = unionBy(draft.friends, users, 'id');

      return draft;
    });
  }
}
