import { Meta } from 'app/store/common/actions';
import { httpRequestFactory, HttpRequestMethod } from 'app/store/common/http';
import { IUser } from 'app/store/common/models';

import { AxiosResponse } from 'axios';
import { SagaIterator } from 'redux-saga';
import { call } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import { IGetUserByPhone } from './action-payloads/get-user-by-phone-action-payload';

export class GetUserByPhone {
  static get action() {
    return createAction('GET_USER_BY_PHONE')<IGetUserByPhone, Meta>();
  }

  static get saga() {
    return function* (action: ReturnType<typeof GetUserByPhone.action>): SagaIterator {
      const { phone } = action.payload;

      try {
        const parsedPhone = phone
          .split('')
          .filter((x) => x !== ' ' && x !== '+')
          .join('');

        const { data } = yield call(() => GetUserByPhone.httpRequest.generator({ phone: parsedPhone }));

        action.meta.deferred?.resolve(data);
      } catch {
        action.meta.deferred?.reject();
      }
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse<IUser>, { phone: string }>(
      ({ phone }: { phone: string }) => `${process.env.MAIN_API}/api/users/phone-number/${phone}`,
      HttpRequestMethod.Get,
    );
  }
}
