import { AxiosResponse } from 'axios';
import produce from 'immer';
import { SagaIterator } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import { httpRequestFactory, HttpRequestMethod } from '@store/common/http';
import { MAIN_API } from '@common/paths';
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
    return produce((draft: IFriendsState) => {
      draft.loading = true;
      return draft;
    });
  }

  static get saga() {
    return function* getFriends(action: ReturnType<typeof GetFriends.action>): SagaIterator {
      const { name, initializedBySearch, page } = action.payload;
      const request = GetFriends.httpRequest;
      const { data } = request.call(yield call(() => request.generator(action.payload)));

      const hasMore = data.length >= page.limit;

      yield put(
        GetFriendsSuccess.action({
          users: data,
          name,
          initializedBySearch,
          hasMore,
        }),
      );
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse<IUser[]>, IGetFriendsApiRequest>(
      MAIN_API.GET_CONTACTS,
      HttpRequestMethod.Post,
    );
  }
}
