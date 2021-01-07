import { httpRequestFactory } from 'app/store/common/http-factory';
import { HttpRequestMethod } from 'app/store/models';

import { AxiosResponse } from 'axios';
import { SagaIterator } from 'redux-saga';
import { put, call } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import { IUpdateMyNicknameActionPayload } from './action-payloads/update-my-nickname-action-payload';
import { IUpdateMyNicknameApiRequest } from './api-requests/update-my-nickname-api-request';
import { UpdateMyNicknameSuccess } from './update-my-nickname-success';

export class UpdateMyNickname {
  static get action() {
    return createAction('UPDATE_MY_NICKNAME')<IUpdateMyNicknameActionPayload>();
  }

  static get saga() {
    return function* (action: ReturnType<typeof UpdateMyNickname.action>): SagaIterator {
      const { status } = UpdateMyNickname.httpRequest.call(yield call(() => UpdateMyNickname.httpRequest.generator(action.payload)));

      if (status === 200) {
        yield put(UpdateMyNicknameSuccess.action(action.payload));
      }
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse, IUpdateMyNicknameApiRequest>(`${process.env.MAIN_API}/api/users/nick-name`, HttpRequestMethod.Put);
  }
}
