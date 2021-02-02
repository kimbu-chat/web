import produce from 'immer';
import { unionBy } from 'lodash';
import { createAction } from 'typesafe-actions';
import { IFriendsState } from '../../friends-state';
import { IGetFriendsSuccessActionPayload } from './action-payloads/get-friends-success-action-payload';

export class GetFriendsSuccess {
  static get action() {
    return createAction('GET_FRIENDS_SUCCESS')<IGetFriendsSuccessActionPayload>();
  }

  static get reducer() {
    return produce((draft: IFriendsState, { payload }: ReturnType<typeof GetFriendsSuccess.action>) => {
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
