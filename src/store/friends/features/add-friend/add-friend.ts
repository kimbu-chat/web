import { AxiosResponse } from 'axios';
import { SagaIterator } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import { httpRequestFactory, HttpRequestMethod } from '@store/common/http';
import { Meta } from '@store/common/actions';
import { IAddFriendActionPayload } from './action-payloads/add-friend-action-payload';
import { AddFriendSuccess } from './add-friend-success';
import { IAddFriendApiRequest } from './api-requests/add-friend-api-request';

export class AddFriend {
  static get action() {
    return createAction('ADD_FRIEND')<IAddFriendActionPayload, Meta>();
  }

  static get saga() {
    return function* addFriend(action: ReturnType<typeof AddFriend.action>): SagaIterator {
      const user = action.payload;

      const phoneToAdd: IAddFriendApiRequest = { phoneNumbers: [user.phoneNumber] };
      yield call(() => AddFriend.httpRequest.generator(phoneToAdd));

      yield put(AddFriendSuccess.action(user));
      action.meta.deferred?.resolve();
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse, IAddFriendApiRequest>(
      `${process.env.MAIN_API}/api/contacts`,
      HttpRequestMethod.Put,
    );
  }
}
