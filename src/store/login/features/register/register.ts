import { AxiosResponse } from 'axios';
import produce from 'immer';
import { ICreateUserRequest } from 'kimbu-models';
import { SagaIterator } from 'redux-saga';
import { call, put, select, take } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';

import { MAIN_API } from '@common/paths';
import { Meta } from '@store/common/actions';
import { authRequestFactory, HttpRequestMethod } from '@store/common/http';
import { Login } from '@store/login/features/login/login';
import {
  authPhoneNumberSelector,
  confirmationCodeSelector,
  twoLetterCountryCodeSelector,
} from '@store/login/selectors';

import { LoginSuccess } from '../login/login-success';

import type { IRegisterActionPayload } from './action-payloads/register-action-payload';
import type { ILoginState } from '@store/login/login-state';

export class Register {
  static get action() {
    return createAction('REGISTER')<IRegisterActionPayload, Meta>();
  }

  static get reducer() {
    return produce((draft: ILoginState) => ({
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
    return authRequestFactory<AxiosResponse, ICreateUserRequest>(
      MAIN_API.REGISTER,
      HttpRequestMethod.Post,
    );
  }
}
