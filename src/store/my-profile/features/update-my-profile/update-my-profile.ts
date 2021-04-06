import { AxiosResponse } from 'axios';
import { SagaIterator } from 'redux-saga';
import { put, call } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import { httpRequestFactory, HttpRequestMethod } from '@store/common/http';
import { Meta } from '@store/common/actions';
import { HTTPStatusCode } from '@common/http-status-code';
import { IUpdateMyProfileActionPayload } from './action-payloads/update-my-profile-action-payload';
import { IUpdateMyProfileApiRequest } from './api-requests/update-my-profile-api-request';
import { UpdateMyProfileSuccess } from './update-my-profile-success';

export class UpdateMyProfile {
  static get action() {
    return createAction('UPDATE_MY_PROFILE_INFO')<IUpdateMyProfileActionPayload, Meta>();
  }

  static get saga() {
    return function* updateMyProfile(
      action: ReturnType<typeof UpdateMyProfile.action>,
    ): SagaIterator {
      const requestData: IUpdateMyProfileApiRequest = {
        firstName: action.payload.firstName,
        lastName: action.payload.lastName,
        nickname: action.payload.nickname,
        avatarId: action.payload.avatar?.id,
      };
      const { httpRequest } = UpdateMyProfile;
      const { status } = httpRequest.call(yield call(() => httpRequest.generator(requestData)));

      if (status === HTTPStatusCode.OK) {
        yield put(UpdateMyProfileSuccess.action(action.payload));
        action.meta.deferred.resolve();
      }
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse, IUpdateMyProfileApiRequest>(
      `${window.__config.REACT_APP_MAIN_API}/api/users`,
      HttpRequestMethod.Put,
    );
  }
}
