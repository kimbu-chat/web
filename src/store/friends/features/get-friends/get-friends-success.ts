import { createAction } from '@reduxjs/toolkit';

import { IFriendsState } from '../../friends-state';

import { IGetFriendsSuccessActionPayload } from './action-payloads/get-friends-success-action-payload';

export class GetFriendsSuccess {
  static get action() {
    return createAction<IGetFriendsSuccessActionPayload>('GET_FRIENDS_SUCCESS');
  }

  static get reducer() {
    return (draft: IFriendsState, { payload }: ReturnType<typeof GetFriendsSuccess.action>) => {
        const { friendIds, hasMore, name, initializedByScroll } = payload;

        if (initializedByScroll) {
          if (name?.length) {
            draft.searchFriends.loading = false;
            draft.searchFriends.hasMore = hasMore;
            draft.searchFriends.friendIds = [
              ...new Set([...draft.searchFriends.friendIds, ...friendIds]),
            ];
          } else {
            draft.friends.loading = false;
            draft.friends.hasMore = hasMore;
            draft.friends.friendIds = [...new Set([...draft.friends.friendIds, ...friendIds])];
          }
        } else {
          draft.searchFriends.loading = false;
          draft.searchFriends.hasMore = hasMore;
          draft.searchFriends.friendIds = friendIds;
        }

        return draft;
      };
  }
}
