import { Meta } from 'app/store/common/actions';
import { httpRequestFactory } from 'app/store/common/http-factory';
import { HttpRequestMethod } from 'app/store/models';

import { AxiosResponse } from 'axios';
import { SagaIterator } from 'redux-saga';
import { call } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import { ICheckNicknameAvailabilityActionPayload } from './check-nickname-availability-action-payload';

export class CheckNicknameAvailability {
  static get action() {
    return createAction('CHECK_NICKNAME_AVAILABILITY')<ICheckNicknameAvailabilityActionPayload, Meta>();
  }

  static get saga() {
    return function* (action: ReturnType<typeof CheckNicknameAvailability.action>): SagaIterator {
      const { data } = CheckNicknameAvailability.httpRequest.call(
        yield call(() => CheckNicknameAvailability.httpRequest.generator({ nickname: action.payload.nickname })),
      );

      action.meta.deferred?.resolve({ isAvailable: data });
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse<boolean>, ICheckNicknameAvailabilityActionPayload>(
      (nickname: ICheckNicknameAvailabilityActionPayload) => `${process.env.MAIN_API}/api/users/check-if-nickname-is-available/${nickname.nickname}`,
      HttpRequestMethod.Get,
    );
  }
}
