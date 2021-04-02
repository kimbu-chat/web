import { AxiosResponse } from 'axios';
import { SagaIterator } from 'redux-saga';
import { put, call, select } from 'redux-saga/effects';
import { authenticatedSelector } from '@store/auth/selectors';
import { createEmptyAction } from '@store/common/actions';
import { HttpRequestMethod, httpRequestFactory } from '@store/common/http';

import { IUser } from '../../../common/models';
import { myIdSelector } from '../../selectors';
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

      const currentUserId = yield select(myIdSelector);

      const { httpRequest } = GetMyProfile;
      const { data } = httpRequest.call(yield call(() => httpRequest.generator(currentUserId)));
      yield put(GetMyProfileSuccess.action({ user: data }));
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse<IUser>, number>(
      (userId: number) => `${window.__config.REACT_APP_MAIN_API}/api/users/${userId}`,
      HttpRequestMethod.Get,
    );
  }
}
