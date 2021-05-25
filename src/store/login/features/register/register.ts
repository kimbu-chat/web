import { AxiosResponse } from 'axios';
import produce from 'immer';
import { SagaIterator } from 'redux-saga';
import { call, put, select } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';

import { Meta } from '@store/common/actions';
import { IAuthState } from '@store/auth/auth-state';
import { authRequestFactory, HttpRequestMethod } from '@store/common/http';
import {
  authPhoneNumberSelector,
  confirmationCodeSelector,
  twoLetterCountryCodeSelector,
} from '@store/login/selectors';
import { Login } from '@store/login/features/login/login';
import { MAIN_API } from '@common/paths';

import { IRegisterActionPayload } from './action-payloads/register-action-payload';
import { IRegisterApiRequest } from './api-requests/register-api-request';

export class Register {
  static get action() {
    return createAction('REGISTER')<IRegisterActionPayload, Meta>();
  }

  static get reducer() {
    return produce((draft: IAuthState) => ({
      ...draft,
      loading: true,
    }));
  }

  static get saga() {
    return function* register(action: ReturnType<typeof Register.action>): SagaIterator {
      const { firstName, lastName, nickname, avatarId } = action.payload;

      const phoneNumber = yield select(authPhoneNumberSelector);

      const twoLetterCountryCode = yield select(twoLetterCountryCodeSelector);

      const confirmationCode = yield select(confirmationCodeSelector);

      yield call(() =>
        Register.httpRequest.generator({
          firstName,
          lastName,
          nickname,
          phoneNumber,
          twoLetterCountryCode,
          avatarId,
        }),
      );

      yield put(Login.action({ phoneNumber, code: confirmationCode }));

      action.meta.deferred.resolve();
    };
  }

  static get httpRequest() {
    return authRequestFactory<AxiosResponse, IRegisterApiRequest>(
      MAIN_API.REGISTER,
      HttpRequestMethod.Post,
    );
  }
}
