import { AxiosResponse } from 'axios';
import { SagaIterator } from 'redux-saga';
import { call } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';

import { MAIN_API } from '@common/paths';
import { Meta } from '@store/common/actions';
import { authRequestFactory, HttpRequestMethod } from '@store/common/http';
import { replaceInUrl } from '@utils/replace-in-url';

import { ICheckNicknameAvailabilityActionPayload } from './action-payloads/check-nickname-availability-action-payload';
import { ICheckNicknameAvailabilityApiRequest } from './api-requests/check-nickname-availability-api-request';

export class CheckNicknameAvailability {
  static get action() {
    return createAction('CHECK_NICKNAME_AVAILABILITY')<
      ICheckNicknameAvailabilityActionPayload,
      Meta
    >();
  }

  static get saga() {
    return function* checkNicknameAvailability(
      action: ReturnType<typeof CheckNicknameAvailability.action>,
    ): SagaIterator {
      const { httpRequest } = CheckNicknameAvailability;
      const { data } = httpRequest.call(
        yield call(() => httpRequest.generator({ nickname: action.payload.nickname })),
      );

      action.meta.deferred?.resolve({ isAvailable: data });
    };
  }

  static get httpRequest() {
    return authRequestFactory<AxiosResponse<boolean>, ICheckNicknameAvailabilityApiRequest>(
      ({ nickname }: ICheckNicknameAvailabilityApiRequest) =>
        replaceInUrl(MAIN_API.CHECK_NICKNAME_AVAILABILITY, ['nickname', nickname]),
      HttpRequestMethod.Get,
    );
  }
}
