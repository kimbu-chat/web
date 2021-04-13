import produce from 'immer';
import unionBy from 'lodash/unionBy';
import { createAction } from 'typesafe-actions';
import { IFriendsState } from '../../friends-state';
import { IGetFriendsSuccessActionPayload } from './action-payloads/get-friends-success-action-payload';

export class GetFriendsSuccess {
  static get action() {
    return createAction('GET_FRIENDS_SUCCESS')<IGetFriendsSuccessActionPayload>();
  }

  static get reducer() {
    return produce(
      (draft: IFriendsState, { payload }: ReturnType<typeof GetFriendsSuccess.action>) => {
        const { users, hasMore, name, initializedByScroll } = payload;

        if (initializedByScroll) {
          if (name?.length) {
            draft.searchFriends.loading = false;
            draft.searchFriends.hasMore = hasMore;
            draft.searchFriends.friends = unionBy(draft.searchFriends.friends, users, 'id');
          } else {
            draft.friends.loading = false;
            draft.friends.hasMore = hasMore;
            draft.friends.friends = unionBy(draft.friends.friends, users, 'id');
          }
        } else {
          draft.searchFriends.loading = false;
          draft.searchFriends.hasMore = hasMore;
          draft.searchFriends.friends = users;
        }

        return draft;
      },
    );
  }
}
