import { AxiosResponse } from 'axios';
import { SagaIterator } from 'redux-saga';
import { put, call, select } from 'redux-saga/effects';
import { authenticatedSelector } from '@store/auth/selectors';
import { createEmptyAction } from '@store/common/actions';
import { userNormalizationSchema } from '@store/friends/normalization';
import { normalize } from 'normalizr';
import { UpdateUsersList } from '@store/users/features/update-users-list/update-users-list';
import { HttpRequestMethod, httpRequestFactory } from '@store/common/http';

import { MAIN_API } from '@common/paths';
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
      const {
        entities: { users },
      } = normalize<IUser, { users: IUser[] }, number[]>(data, userNormalizationSchema);
      yield put(UpdateUsersList.action({ users }));

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
