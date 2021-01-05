import { httpRequestFactory } from 'app/store/common/http-factory';
import { HttpRequestMethod } from 'app/store/models';

import { AxiosResponse } from 'axios';
import { SagaIterator } from 'redux-saga';
import { put, call } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import { IUpdateMyProfileActionPayload } from './action-payloads/update-my-profile-action-payload';
import { IUpdateMyProfileApiRequest } from './api-requests/update-my-profile-api-request';
import { UpdateMyProfileSuccess } from './update-my-profile-success';

export class UpdateMyProfile {
  static get action() {
    return createAction('UPDATE_MY_PROFILE_INFO')<IUpdateMyProfileActionPayload>();
  }

  static get saga() {
    return function* (action: ReturnType<typeof UpdateMyProfile.action>): SagaIterator {
      try {
        const requestData: IUpdateMyProfileApiRequest = {
          firstName: action.payload.firstName,
          lastName: action.payload.lastName,
          avatarId: action.payload.avatar?.id,
        };
        const { status } = UpdateMyProfile.httpRequest.call(yield call(() => UpdateMyProfile.httpRequest.generator(requestData)));

        if (status === 200) {
          yield put(UpdateMyProfileSuccess.action(action.payload));
        }
      } catch (err) {
        alert(err);
      }
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse, IUpdateMyProfileApiRequest>(`${process.env.MAIN_API}/api/users`, HttpRequestMethod.Put);
  }
}
