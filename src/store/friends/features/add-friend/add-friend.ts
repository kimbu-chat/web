import { AxiosResponse } from 'axios';
import { SagaIterator } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';

import { httpRequestFactory, HttpRequestMethod } from '@store/common/http';
import { Meta } from '@store/common/actions';
import { MAIN_API } from '@common/paths';

import { IAddFriendApiRequest } from './api-requests/add-friend-api-request';
import { AddFriendSuccess } from './add-friend-success';

export class AddFriend {
  static get action() {
    return createAction('ADD_FRIEND')<number, Meta>();
  }

  static get saga() {
    return function* addFriend(action: ReturnType<typeof AddFriend.action>): SagaIterator {
      const userId = action.payload;

      const phoneToAdd: IAddFriendApiRequest = { userId };
      yield call(() => AddFriend.httpRequest.generator(phoneToAdd));

      yield put(AddFriendSuccess.action(userId));

      action.meta.deferred?.resolve();
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse, IAddFriendApiRequest>(
      MAIN_API.ADD_CONTACT,
      HttpRequestMethod.Post,
    );
  }
}
