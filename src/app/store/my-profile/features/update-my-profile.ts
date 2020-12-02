import { SagaIterator } from 'redux-saga';
import { put, call } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import { MyProfileHttpRequests } from '../http-requests';
import { UpdateMyProfileActionData, UpdateMyProfileApiRequestData } from '../models';
import { UpdateMyProfileSuccess } from './update-my-profile-success';

export class UpdateMyProfile {
  static get action() {
    return createAction('UPDATE_MY_PROFILE_INFO')<UpdateMyProfileActionData>();
  }

  static get saga() {
    return function* (action: ReturnType<typeof UpdateMyProfile.action>): SagaIterator {
      try {
        const requestData: UpdateMyProfileApiRequestData = {
          firstName: action.payload.firstName,
          lastName: action.payload.lastName,
          avatarId: action.payload.avatar?.id,
        };
        const updateProfileRequest = MyProfileHttpRequests.updateMyProfile;
        const { status } = updateProfileRequest.call(yield call(() => updateProfileRequest.generator(requestData)));

        if (status === 200) {
          yield put(UpdateMyProfileSuccess.action(action.payload));
        }
      } catch (err) {
        alert(err);
      }
    };
  }
}
