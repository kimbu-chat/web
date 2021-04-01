import { AxiosResponse } from 'axios';
import produce from 'immer';
import { SagaIterator } from 'redux-saga';
import { call, put, select, take } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';

import { Meta } from '@store/common/actions';
import { IAuthState } from '@store/auth/auth-state';
import { authRequestFactory, HttpRequestMethod } from '@store/common/http';
import {
  authPhoneNumberSelector,
  confirmationCodeSelector,
  twoLetterCountryCodeSelector,
} from '@store/auth/selectors';
import { Login } from '@store/auth/features/login/login';
import { LoginSuccess } from '@store/auth/features/login/login-success';

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
      yield take(LoginSuccess.action);

      action.meta.deferred.resolve();
    };
  }

  static get httpRequest() {
    return authRequestFactory<AxiosResponse, IRegisterApiRequest>(
      `${process.env.REACT_APP_MAIN_API}/api/users/`,
      HttpRequestMethod.Post,
    );
  }
}
