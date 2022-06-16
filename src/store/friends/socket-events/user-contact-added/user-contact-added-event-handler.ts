import { createAction } from '@reduxjs/toolkit';
import { AxiosResponse } from 'axios';
import { IUser } from 'kimbu-models';
import { SagaIterator } from 'redux-saga';
import { put, select, call } from 'redux-saga/effects';

import { MAIN_API } from '@common/paths';
import { httpRequestFactory, HttpRequestMethod } from '@store/common/http';
import { AddOrUpdateUsers } from '@store/users/features/add-or-update-users/add-or-update-users';
import { getUserSelector } from '@store/users/selectors';
import { replaceInUrl } from '@utils/replace-in-url';

import { IUserContactAddedIntegrationEvent } from './user-contact-added-integration-event';
import { UserContactAddedSuccessEventHandler } from './user-contact-added-success-event-handler';

export class UserContactAddedEventHandler {
  static get action() {
    return createAction<IUserContactAddedIntegrationEvent>('UserContactAdded');
  }

  static get saga() {
    return function* userContactAddedSaga(
      action: ReturnType<typeof UserContactAddedEventHandler.action>,
    ): SagaIterator {
      const userExists = Boolean(yield select(getUserSelector(action.payload.userId)));

      if (!userExists) {
        const { data: user } = UserContactAddedEventHandler.httpRequest.call(
          yield call(() =>
            UserContactAddedEventHandler.httpRequest.generator(action.payload.userId),
          ),
        );

        yield put(AddOrUpdateUsers.action({ users: { [user.id]: user } }));
      }

      yield put(UserContactAddedSuccessEventHandler.action(action.payload));
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse<IUser>, number>(
      (id) => replaceInUrl(MAIN_API.GET_USER, ['userId', id]),
      HttpRequestMethod.Get,
    );
  }
}
