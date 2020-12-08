import { httpRequestFactory, HttpRequestMethod } from 'app/store/common/http-factory';
import { UserPreview } from 'app/store/my-profile/models';
import { ApiBasePath } from 'app/store/root-api';
import { AxiosResponse } from 'axios';
import produce from 'immer';
import { SagaIterator } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import { FriendsState } from '../../models';
import { GetFriendsActionPayload } from './get-friends-action-payload';
import { GetFriendsSuccess } from './get-friends-success';

export class GetFriends {
  static get action() {
    return createAction('GET_FRIENDS')<GetFriendsActionPayload>();
  }

  static get reducer() {
    return produce((draft: FriendsState) => {
      draft.loading = true;
      return draft;
    });
  }

  static get saga() {
    return function* (action: ReturnType<typeof GetFriends.action>): SagaIterator {
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
    return httpRequestFactory<AxiosResponse<UserPreview[]>, GetFriendsActionPayload>(`${ApiBasePath.MainApi}/api/contacts/search`, HttpRequestMethod.Post);
  }
}
