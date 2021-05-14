import { AxiosResponse } from 'axios';
import { SagaIterator } from 'redux-saga';
import { put, call, select } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';

import { AddOrUpdateUsers } from '@store/users/features/add-or-update-users/add-or-update-users';
import { httpRequestFactory, HttpRequestMethod } from '@store/common/http';
import { Meta } from '@store/common/actions';
import { HTTPStatusCode } from '@common/http-status-code';
import { MAIN_API } from '@common/paths';
import { myProfileSelector } from '@store/my-profile/selectors';

import { IUpdateMyProfileActionPayload } from './action-payloads/update-my-profile-action-payload';
import { IUpdateMyProfileApiRequest } from './api-requests/update-my-profile-api-request';

export class UpdateMyProfile {
  static get action() {
    return createAction('UPDATE_MY_PROFILE_INFO')<IUpdateMyProfileActionPayload, Meta>();
  }

  static get saga() {
    return function* updateMyProfile(
      action: ReturnType<typeof UpdateMyProfile.action>,
    ): SagaIterator {
      const { firstName, lastName, nickname, avatar } = action.payload;

      const requestData: IUpdateMyProfileApiRequest = {
        firstName,
        lastName,
        nickname,
        avatarId: action.payload.avatar?.id,
      };
      const { httpRequest } = UpdateMyProfile;
      const { status } = httpRequest.call(yield call(() => httpRequest.generator(requestData)));

      if (status === HTTPStatusCode.OK) {
        const myProfile = yield select(myProfileSelector);

        if (myProfile) {
          const updatedProfile = {
            ...myProfile,
            firstName,
            lastName,
            nickname,
            avatar,
          };
          yield put(AddOrUpdateUsers.action({ users: { [updatedProfile.id]: updatedProfile } }));
        }

        action.meta.deferred.resolve();
      }
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse, IUpdateMyProfileApiRequest>(
      MAIN_API.UPDATE_PROFILE,
      HttpRequestMethod.Put,
    );
  }
}
