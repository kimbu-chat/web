import { HTTPStatusCode } from 'app/common/http-status-code';
import { httpRequestFactory, HttpRequestMethod } from 'app/store/common/http-factory';
import { UserPreview } from 'app/store/my-profile/models';
import { ApiBasePath } from 'app/store/root-api';
import { AxiosResponse } from 'axios';
import { SagaIterator } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import { UpdateFriendListActionData } from '../models';
import { AddFriendSuccess } from './add-friend-success';

export class AddFriend {
  static get action() {
    return createAction('ADD_FRIEND')<UserPreview>();
  }

  static get saga() {
    return function* (action: ReturnType<typeof AddFriend.action>): SagaIterator {
      const user = action.payload;
      try {
        const phoneToAdd: UpdateFriendListActionData = { phoneNumbers: [user.phoneNumber] };
        const { httpRequest } = AddFriend;
        const { status } = httpRequest.call(yield call(() => httpRequest.generator(phoneToAdd)));

        if (status === HTTPStatusCode.OK) {
          yield put(AddFriendSuccess.action(user));
        } else {
          alert('Failed to add contact');
        }
      } catch {
        alert('Failed to add contact');
      }
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse, UpdateFriendListActionData>(`${ApiBasePath.MainApi}/api/contacts`, HttpRequestMethod.Put);
  }
}
