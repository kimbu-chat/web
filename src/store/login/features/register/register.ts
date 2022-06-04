import { AxiosResponse } from 'axios';
import { ICreateUserRequest } from 'kimbu-models';
import { SagaIterator } from 'redux-saga';
import { call, put, select, take } from 'redux-saga/effects';

import { MAIN_API } from '@common/paths';
import { createDeferredAction } from '@store/common/actions';
import { authRequestFactory, HttpRequestMethod } from '@store/common/http';
import { Login } from '@store/login/features/login/login';
import { authPhoneNumberSelector, confirmationCodeSelector } from '@store/login/selectors';

import { LoginSuccess } from '../login/login-success';

import type { IRegisterActionPayload } from './action-payloads/register-action-payload';
import type { ILoginState } from '@store/login/login-state';

export class Register {
  static get action() {
    return createDeferredAction<IRegisterActionPayload>('REGISTER');
  }

  static get reducer() {
    return (draft: ILoginState) => {
      draft.loading = true;
    };
  }

  static get saga() {
    return function* register(action: ReturnType<typeof Register.action>): SagaIterator {
      const { firstName, lastName, nickname, avatarId } = action.payload;

      const phoneNumber = yield select(authPhoneNumberSelector);

      const confirmationCode = yield select(confirmationCodeSelector);

      yield call(Register.httpRequest.generator, {
        firstName,
        lastName,
        nickname,
        phoneNumber,
        avatarId,
      });

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
