import { createAction } from '@reduxjs/toolkit';
import { AxiosResponse } from 'axios';
import { IGetContactsRequest, IUser } from 'kimbu-models';
import { normalize } from 'normalizr';
import { SagaIterator } from 'redux-saga';
import { call, put, select } from 'redux-saga/effects';

import { MAIN_API } from '@common/paths';
import { httpRequestFactory, HttpRequestMethod } from '@store/common/http';
import { userArrNormalizationSchema } from '@store/friends/normalization';
import {
  getLoadedFriendsCountSelector,
  getLoadedSearchFriendsCountSelector,
} from '@store/friends/selectors';
import { AddOrUpdateUsers } from '@store/users/features/add-or-update-users/add-or-update-users';

import { FRIENDS_LIMIT } from '../../../../utils/pagination-limits';
import { IFriendsState } from '../../friends-state';

import { IGetFriendsActionPayload } from './action-payloads/get-friends-action-payload';
import { GetFriendsSuccess } from './get-friends-success';

export class GetFriends {
  static get action() {
    return createAction<IGetFriendsActionPayload>('GET_FRIENDS');
  }

  static get reducer() {
    return (draft: IFriendsState, { payload }: ReturnType<typeof GetFriends.action>) => {
      if (!payload.name?.length && !payload.initializedByScroll) {
        draft.searchFriends.friendIds = [];
        draft.searchFriends.hasMore = true;
        draft.searchFriends.loading = false;
      }

      if (payload.name?.length) {
        draft.searchFriends.loading = true;
      } else if (payload.initializedByScroll) {
        draft.friends.loading = true;
      }

      return draft;
    };
  }

  static get saga() {
    return function* getFriends(action: ReturnType<typeof GetFriends.action>): SagaIterator {
      const { name, initializedByScroll } = action.payload;

      if (!name?.length && !initializedByScroll) {
        return;
      }

      const loadedFriendsCount = yield select(getLoadedFriendsCountSelector);
      const loadedSearchFriendsCount = yield select(getLoadedSearchFriendsCountSelector);

      const request: IGetContactsRequest = {
        name: action.payload.name,
        page: {
          limit: FRIENDS_LIMIT,
          offset: action.payload.name?.length ? loadedSearchFriendsCount : loadedFriendsCount,
        },
      };

      const { httpRequest } = GetFriends;
      const { data } = httpRequest.call(yield call(() => httpRequest.generator(request)));

      const hasMore = data.length >= FRIENDS_LIMIT;

      const {
        entities: { users },
        result,
      } = normalize<IUser[], { users: Record<number, IUser> }, number[]>(
        data,
        userArrNormalizationSchema,
      );

      yield put(
        GetFriendsSuccess.action({
          friendIds: result,
          name,
          initializedByScroll,
          hasMore,
        }),
      );

      yield put(AddOrUpdateUsers.action({ users }));
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse<IUser[]>, IGetContactsRequest>(
      MAIN_API.GET_CONTACTS,
      HttpRequestMethod.Post,
    );
  }
}
