import { AxiosResponse } from 'axios';
import { SagaIterator } from 'redux-saga';
import { put, call } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';

import { httpRequestFactory, HttpRequestMethod } from '@store/common/http';
import { MAIN_API } from '@common/paths';
import { HTTPStatusCode } from '@common/http-status-code';
import { Meta } from '@store/common/actions';

import { IDeleteFriendApiRequest } from './api-requests/delete-friend-api-request';
import { DeleteFriendSuccess } from './delete-friend-success';

export class DeleteFriend {
  static get action() {
    return createAction('DELETE_FRIEND')<number, Meta>();
  }

  static get saga() {
    return function* deleteFriend(action: ReturnType<typeof DeleteFriend.action>): SagaIterator {
      const userId = action.payload;

      const { status } = yield call(() =>
        DeleteFriend.httpRequest.generator({ userIds: [action.payload] }),
      );

      if (status === HTTPStatusCode.OK) {
        yield put(DeleteFriendSuccess.action(userId));
        action.meta.deferred?.resolve();
      }
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse, IDeleteFriendApiRequest>(
      MAIN_API.DELETE_CONTACTS,
      HttpRequestMethod.Post,
    );
  }
}
