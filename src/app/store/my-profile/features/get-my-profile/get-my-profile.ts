import { MyProfileService } from 'app/services/my-profile-service';
import { authenticatedSelector } from 'app/store/auth/selectors';
import { createEmptyAction } from 'app/store/common/actions';
import { HttpRequestMethod, httpRequestFactory } from 'app/store/common/http';

import { IUser } from 'app/store/common/models';
import { AxiosResponse } from 'axios';
import { SagaIterator } from 'redux-saga';
import { put, call, select } from 'redux-saga/effects';
import { GetMyProfileSuccess } from './get-my-profile-success';

export class GetMyProfile {
  static get action() {
    return createEmptyAction('GET_MY_PROFILE');
  }

  static get saga() {
    return function* (): SagaIterator {
      const authenticated = yield select(authenticatedSelector);

      if (!authenticated) {
        return;
      }

      const profileService = new MyProfileService();
      const currentUserId = profileService.myProfile.id;

      const { httpRequest } = GetMyProfile;
      const { data } = httpRequest.call(yield call(() => httpRequest.generator(currentUserId)));
      profileService.setMyProfile(data);
      yield put(GetMyProfileSuccess.action(data));
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse<IUser>, number>((userId: number) => `${process.env.MAIN_API}/api/users/${userId}`, HttpRequestMethod.Get);
  }
}
