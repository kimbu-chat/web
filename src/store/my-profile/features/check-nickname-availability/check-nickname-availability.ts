import { AxiosResponse } from 'axios';
import { SagaIterator } from 'redux-saga';
import { call } from 'redux-saga/effects';

import { MAIN_API } from '@common/paths';
import { createDeferredAction } from '@store/common/actions';
import { authRequestFactory, HttpRequestMethod } from '@store/common/http';
import { replaceInUrl } from '@utils/replace-in-url';

import { ICheckNicknameAvailabilityActionPayload } from './action-payloads/check-nickname-availability-action-payload';

export class CheckNicknameAvailability {
  static get action() {
    return createDeferredAction<ICheckNicknameAvailabilityActionPayload, boolean>('CHECK_NICKNAME_AVAILABILITY');
  }

  static get saga() {
    return function* checkNicknameAvailability(
      action: ReturnType<typeof CheckNicknameAvailability.action>,
    ): SagaIterator {
      const { httpRequest } = CheckNicknameAvailability;
      const { data } = httpRequest.call(
        yield call(() => httpRequest.generator(action.payload.nickname)),
      );

      action.meta.deferred?.resolve(data);
    };
  }

  static get httpRequest() {
    return authRequestFactory<AxiosResponse<boolean>, string>(
      (nickname: string) =>
        replaceInUrl(MAIN_API.CHECK_NICKNAME_AVAILABILITY, ['nickname', nickname]),
      HttpRequestMethod.Get,
    );
  }
}
