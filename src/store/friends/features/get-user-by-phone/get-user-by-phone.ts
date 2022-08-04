import { AxiosResponse } from 'axios';
import { IUser } from 'kimbu-models';
import { SagaIterator } from 'redux-saga';
import { call } from 'redux-saga/effects';

import { MAIN_API } from '@common/paths';
import { createDeferredAction } from '@store/common/actions';
import { httpRequestFactory, HttpRequestMethod } from '@store/common/http';
import { replaceInUrl } from '@utils/replace-in-url';

import { IGetUserByPhone } from './action-payloads/get-user-by-phone-action-payload';

export class GetUserByPhone {
  static get action() {
    return createDeferredAction<IGetUserByPhone, IUser>('GET_USER_BY_PHONE');
  }

  static get saga() {
    return function* GetUserByPhoneSaga(
      action: ReturnType<typeof GetUserByPhone.action>,
    ): SagaIterator {
      const { phone } = action.payload;

      try {
        const parsedPhone = phone
          .split('')
          .filter((x) => x !== ' ' && x !== '+')
          .join('');

        const response = GetUserByPhone.httpRequest.call(
          yield call(() => GetUserByPhone.httpRequest.generator({ phone: parsedPhone })),
        );

        if (response.status === 204) throw new Error('204 has been returned');

        action.meta?.deferred?.resolve(response.data);
      } catch(e) {
        action.meta?.deferred?.reject();
      }
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse<IUser>, { phone: string }>(
      ({ phone }: { phone: string }) =>
        replaceInUrl(MAIN_API.GET_USER_BY_PHONE, ['phoneNumber', phone]),
      HttpRequestMethod.Get,
    );
  }
}
