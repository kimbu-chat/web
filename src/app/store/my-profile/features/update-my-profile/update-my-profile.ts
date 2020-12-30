import { httpRequestFactory } from 'app/store/common/http-factory';
import { HttpRequestMethod } from 'app/store/common/models';
import { ApiBasePath } from 'app/store/root-api';
import { AxiosResponse } from 'axios';
import { SagaIterator } from 'redux-saga';
import { put, call } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import { IUpdateMyProfileApiRequestData } from '../../models';
import { IUpdateMyProfileActionPayload } from './update-my-profile-action-payload';
import { UpdateMyProfileSuccess } from './update-my-profile-success';

export class UpdateMyProfile {
  static get action() {
    return createAction('UPDATE_MY_PROFILE_INFO')<IUpdateMyProfileActionPayload>();
  }

  static get saga() {
    return function* (action: ReturnType<typeof UpdateMyProfile.action>): SagaIterator {
      try {
        const requestData: IUpdateMyProfileApiRequestData = {
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
    return httpRequestFactory<AxiosResponse, IUpdateMyProfileApiRequestData>(`${ApiBasePath.MainApi}/api/users`, HttpRequestMethod.Put);
  }
}
