import { MyProfileService } from 'app/services/my-profile-service';
import { createEmptyAction } from 'app/store/common/actions';
import { httpRequestFactory } from 'app/store/common/http-factory';
import { HttpRequestMethod, IUserPreview } from 'app/store/models';

import { AxiosResponse } from 'axios';
import { SagaIterator } from 'redux-saga';
import { put, call } from 'redux-saga/effects';
import { GetMyProfileSuccess } from './get-my-profile-success';

export class GetMyProfile {
  static get action() {
    return createEmptyAction('GET_MY_PROFILE');
  }

  static get saga() {
    return function* (): SagaIterator {
      const profileService = new MyProfileService();
      const currentUserId = profileService.myProfile.id;

      const { data } = GetMyProfile.httpRequest.call(yield call(() => GetMyProfile.httpRequest.generator(currentUserId)));
      profileService.setMyProfile(data);
      yield put(GetMyProfileSuccess.action(data));
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse<IUserPreview>, number>((userId: number) => `${process.env.MAIN_API}/api/users/${userId}`, HttpRequestMethod.Get);
  }
}
