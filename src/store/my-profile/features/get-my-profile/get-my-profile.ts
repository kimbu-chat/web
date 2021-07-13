import { AxiosResponse } from 'axios';
import { normalize } from 'normalizr';
import { SagaIterator } from 'redux-saga';
import { put, call, select } from 'redux-saga/effects';

import { MAIN_API } from '@common/paths';
import { Logout } from '@store/auth/features/logout/logout';
import { authenticatedSelector } from '@store/auth/selectors';
import { ById } from '@store/chats/models/by-id';
import { createEmptyAction } from '@store/common/actions';
import { HttpRequestMethod, httpRequestFactory } from '@store/common/http';
import { userSchema } from '@store/friends/normalization';
import { AddOrUpdateUsers } from '@store/users/features/add-or-update-users/add-or-update-users';

import { IUser } from '../../../common/models';

import { GetMyProfileSuccess } from './get-my-profile-success';

export class GetMyProfile {
  static get action() {
    return createEmptyAction('GET_MY_PROFILE');
  }

  static get saga() {
    return function* getMyProfile(): SagaIterator {
      const authenticated = yield select(authenticatedSelector);

      if (!authenticated) {
        return;
      }

      const { httpRequest } = GetMyProfile;
      const { data } = httpRequest.call(yield call(() => httpRequest.generator()));

      if (data.deleted || data.deactivated) {
        yield call(Logout.saga);
        return;
      }

      const {
        entities: { users },
      } = normalize<IUser, { users: ById<IUser> }, number[]>(data, userSchema);
      yield put(AddOrUpdateUsers.action({ users }));

      yield put(GetMyProfileSuccess.action({ user: data }));
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse<IUser>, number>(
      MAIN_API.GET_MY_PROFILE,
      HttpRequestMethod.Get,
    );
  }
}
