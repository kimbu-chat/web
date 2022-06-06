import { AxiosResponse } from 'axios';
import { IAddUserIntoContactsRequest, IUser } from 'kimbu-models';
import { SagaIterator } from 'redux-saga';
import { call, put } from 'redux-saga/effects';

import { MAIN_API } from '@common/paths';
import { createDeferredAction } from '@store/common/actions';
import { httpRequestFactory, HttpRequestMethod } from '@store/common/http';
import { AddOrUpdateUsers } from '@store/users/features/add-or-update-users/add-or-update-users';

import { AddFriendSuccess } from './add-friend-success';

export class AddFriend {
  static get action() {
    return createDeferredAction<IUser>('ADD_FRIEND');
  }

  static get saga() {
    return function* addFriend(action: ReturnType<typeof AddFriend.action>): SagaIterator {
      const user = action.payload;

      const phoneToAdd: IAddUserIntoContactsRequest = { userId: user.id };
      yield call(() => AddFriend.httpRequest.generator(phoneToAdd));

      yield put(AddFriendSuccess.action(user.id));
      yield put(
        AddOrUpdateUsers.action({
          users: {
            [user.id]: user,
          },
        }),
      );

      action.meta.deferred?.resolve();
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse, IAddUserIntoContactsRequest>(
      MAIN_API.ADD_CONTACT,
      HttpRequestMethod.Post,
    );
  }
}
