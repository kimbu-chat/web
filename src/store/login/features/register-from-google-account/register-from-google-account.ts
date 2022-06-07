import { AxiosResponse } from 'axios';
import { ICreateUserFromGoogleAccountRequest } from 'kimbu-models';
import { SagaIterator } from 'redux-saga';
import { call, put, select, take } from 'redux-saga/effects';

import { MAIN_API } from '@common/paths';
import {createDeferredAction} from '@store/common/actions';
import { authRequestFactory, HttpRequestMethod } from '@store/common/http';
import { LoginFromGoogleAccountSuccess } from '@store/login/features/login-from-google-account/login-from-google-account-success';
import { LoginFromGoogleAccount } from '@store/login/features/login-from-google-account/login-from-google-account';
import { googleIdTokenSelector } from '@store/login/selectors';

export interface IRegisterFromGoogleActionPayload {
  lastName: string;
  firstName: string;
  nickname: string;
  avatarId?: number;
}

export class RegisterFromGoogleAccount {
  static get action() {
    return createDeferredAction<IRegisterFromGoogleActionPayload>('REGISTER_FROM_GOOGLE_ACCOUNT');
  }

  static get saga() {
    return function* register(
      action: ReturnType<typeof RegisterFromGoogleAccount.action>,
    ): SagaIterator {
      const { firstName, lastName, nickname, avatarId } = action.payload;

      const idToken = yield select(googleIdTokenSelector);

      const request: ICreateUserFromGoogleAccountRequest = {
        firstName,
        lastName,
        nickname,
        avatarId,
        googleIdToken: idToken,
        googleRefreshToken: '',
      };

      yield call(RegisterFromGoogleAccount.httpRequest.generator, request);

      yield put(LoginFromGoogleAccount.action({ idToken }, ));
      yield take(LoginFromGoogleAccountSuccess.action);
      action.meta?.deferred?.resolve();
    };
  }

  static get httpRequest() {
    return authRequestFactory<AxiosResponse, ICreateUserFromGoogleAccountRequest>(
      MAIN_API.REGISTER_FROM_GOOGLE,
      HttpRequestMethod.Post,
    );
  }
}
