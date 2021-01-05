import { HTTPStatusCode } from 'app/common/http-status-code';
import { httpRequestFactory, HttpRequestMethod } from 'app/store/common/http-factory';

import { AxiosResponse } from 'axios';
import { SagaIterator } from 'redux-saga';
import { put, call } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import { IDeleteFriendActionPayload } from './action-payloads/delete-friend-action-payload';
import { IDeleteFriendApiRequest } from './api-requests/delete-friend-api-request';
import { DeleteFriendSuccess } from './delete-friend-success';

export class DeleteFriend {
  static get action() {
    return createAction('DELETE_FRIEND')<IDeleteFriendActionPayload>();
  }

  static get saga() {
    return function* (action: ReturnType<typeof DeleteFriend.action>): SagaIterator {
      const userId = action.payload;
      try {
        const { status } = DeleteFriend.httpRequest.call(yield call(() => DeleteFriend.httpRequest.generator(action.payload)));

        if (status === HTTPStatusCode.OK) {
          yield put(DeleteFriendSuccess.action(userId));
        } else {
          alert('Failed to delete contact');
        }
      } catch {
        alert('Failed to delete contact');
      }
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse, IDeleteFriendApiRequest>(`${process.env.MAIN_API}/api/contacts/batch-delete`, HttpRequestMethod.Post);
  }
}
