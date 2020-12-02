import { MyProfileService } from 'app/services/my-profile-service';
import { createEmptyAction } from 'app/store/common/actions';
import { SagaIterator } from 'redux-saga';
import { put, call } from 'redux-saga/effects';
import { MyProfileHttpRequests } from '../http-requests';
import { GetMyProfileSuccess } from './get-my-profile-success';

export class GetMyProfile {
  static get action() {
    return createEmptyAction('GET_MY_PROFILE');
  }

  static get saga() {
    return function* (): SagaIterator {
      const profileService = new MyProfileService();
      const currentUserId = profileService.myProfile.id;

      const httpRequest = MyProfileHttpRequests.getUserProfile;
      const { data } = httpRequest.call(yield call(() => httpRequest.generator(currentUserId)));
      profileService.setMyProfile(data);
      yield put(GetMyProfileSuccess.action(data));
    };
  }
}
