import { AxiosResponse } from 'axios';
import { IRemoveUsersFromContactListCommand } from 'kimbu-models';
import { SagaIterator } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';

import { HTTPStatusCode } from '@common/http-status-code';
import { MAIN_API } from '@common/paths';
import { Meta } from '@store/common/actions';
import { httpRequestFactory, HttpRequestMethod } from '@store/common/http';

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
    return httpRequestFactory<AxiosResponse, IRemoveUsersFromContactListCommand>(
      MAIN_API.DELETE_CONTACTS,
      HttpRequestMethod.Post,
    );
  }
}
