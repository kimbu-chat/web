import { AxiosResponse } from 'axios';
import produce from 'immer';
import { normalize } from 'normalizr';
import { SagaIterator } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';

import { MAIN_API } from '@common/paths';
import { ById } from '@store/chats/models/by-id';
import { httpRequestFactory, HttpRequestMethod } from '@store/common/http';
import { userArrNormalizationSchema } from '@store/friends/normalization';
import { AddOrUpdateUsers } from '@store/users/features/add-or-update-users/add-or-update-users';

import { IUser } from '../../../common/models';
import { IFriendsState } from '../../friends-state';

import { IGetFriendsActionPayload } from './action-payloads/get-friends-action-payload';
import { IGetFriendsApiRequest } from './api-requests/get-friends-api-request';
import { GetFriendsSuccess } from './get-friends-success';

export class GetFriends {
  static get action() {
    return createAction('GET_FRIENDS')<IGetFriendsActionPayload>();
  }

  static get reducer() {
    return produce((draft: IFriendsState, { payload }: ReturnType<typeof GetFriends.action>) => {
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
    });
  }

  static get saga() {
    return function* getFriends(action: ReturnType<typeof GetFriends.action>): SagaIterator {
      const { name, initializedByScroll, page } = action.payload;

      if (!name?.length && !initializedByScroll) {
        return;
      }

      const request = GetFriends.httpRequest;
      const { data } = request.call(yield call(() => request.generator(action.payload)));

      const hasMore = data.length >= page.limit;

      const {
        entities: { users },
        result,
      } = normalize<IUser[], { users: ById<IUser> }, number[]>(data, userArrNormalizationSchema);

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
    return httpRequestFactory<AxiosResponse<IUser[]>, IGetFriendsApiRequest>(
      MAIN_API.GET_CONTACTS,
      HttpRequestMethod.Post,
    );
  }
}
