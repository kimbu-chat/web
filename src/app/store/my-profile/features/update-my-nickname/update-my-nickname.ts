import { Meta } from 'app/store/common/actions';
import { httpRequestFactory } from 'app/store/common/http-factory';
import { HttpRequestMethod } from 'app/store/models';

import { AxiosResponse } from 'axios';
import { SagaIterator } from 'redux-saga';
import { put, call } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import { IUpdateMyNicknameActionPayload } from './update-my-nickname-action-payload';
import { UpdateMyNicknameSuccess } from './update-my-nickname-success';

export class UpdateMyNickname {
  static get action() {
    return createAction('UPDATE_MY_NICKNAME')<IUpdateMyNicknameActionPayload, Meta>();
  }

  static get saga() {
    return function* (action: ReturnType<typeof UpdateMyNickname.action>): SagaIterator {
      try {
        const { status } = UpdateMyNickname.httpRequest.call(yield call(() => UpdateMyNickname.httpRequest.generator(action.payload)));

        if (status === 200) {
          yield put(UpdateMyNicknameSuccess.action(action.payload));
          action.meta.deferred?.resolve();
        } else {
          action.meta.deferred?.reject();
        }
      } catch {
        action.meta.deferred?.reject();
      }
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse, IUpdateMyNicknameActionPayload>(`${process.env.MAIN_API}/api/users/nick-name`, HttpRequestMethod.Put);
  }
}
