import { AxiosError, AxiosResponse } from 'axios';
import jwtDecode from 'jwt-decode';
import {
  ApplicationErrorCode,
  IApplicationError,
  ISecurityTokens,
  ISignInFromGoogleRequest,
} from 'kimbu-models';
import { SagaIterator } from 'redux-saga';
import { apply, call, put } from 'redux-saga/effects';

import { HTTPStatusCode } from '@common/http-status-code';
import { MAIN_API } from '@common/paths';
import { AuthService } from '@services/auth-service';
import {createDeferredAction} from '@store/common/actions';
import { authRequestFactory } from '@store/common/http/auth-request-factory';
import { HttpRequestMethod } from '@store/common/http/http-request-method';
import { LoginFromGoogleAccountSuccess } from '@store/login/features/login-from-google-account/login-from-google-account-success';
import { isNetworkError } from '@utils/error-utils';

import { ICustomJwtPayload } from '../login/models/custom-jwt-payload';

import type { ILoginState } from '@store/login/login-state';

export interface ILoginFromGoogleAccountActionPayload {
  idToken: string;
}

export enum LoginFromGoogleAccountResult {
  GoogleAuthDisabled,
  IdTokenInvalid,
  UserNotRegistered,
  NetworkError,
  Success,
  UnknownError,
}

const mapError = (error: AxiosError): LoginFromGoogleAccountResult => {
  if (isNetworkError(error)) {
    return LoginFromGoogleAccountResult.NetworkError;
  }

  const { response } = error;
  const status = response?.status;
  const errorData = response?.data as IApplicationError;
  if (status === HTTPStatusCode.Forbidden) {
    return LoginFromGoogleAccountResult.GoogleAuthDisabled;
  }
  if (status === HTTPStatusCode.UnprocessableEntity) {
    if (errorData.code === ApplicationErrorCode.GoogleAuthDisabled) {
      return LoginFromGoogleAccountResult.GoogleAuthDisabled;
    }
    if (errorData.code === ApplicationErrorCode.UserNotRegistered) {
      return LoginFromGoogleAccountResult.UserNotRegistered;
    }
  }

  return LoginFromGoogleAccountResult.UnknownError;
};

export class LoginFromGoogleAccount {
  static get action() {
    return createDeferredAction<ILoginFromGoogleAccountActionPayload, LoginFromGoogleAccountResult>('LOGIN_FROM_GOOGLE_ACCOUNT');
  }

  static get reducer() {
    return (draft: ILoginState, { payload }: ReturnType<typeof LoginFromGoogleAccount.action>) => {
      draft.googleAuthLoading = true;
      draft.googleAuthIdToken = payload.idToken;
      draft.loginSource = 'phone-number';
    };
  }

  static get saga() {
    return function* sendSmsPhoneConfirmationCodeSaga(
      action: ReturnType<typeof LoginFromGoogleAccount.action>,
    ): SagaIterator {
      try {
        const { httpRequest } = LoginFromGoogleAccount;

        const { data }: AxiosResponse<ISecurityTokens> = httpRequest.call(
          yield call(() =>
            httpRequest.generator({
              idToken: action.payload.idToken,
            }),
          ),
        );

        const decodedJwt = jwtDecode<ICustomJwtPayload>(data.accessToken);

        const deviceId = decodedJwt.refreshTokenId;

        const authService = new AuthService();

        yield apply(authService, authService.initialize, [data, deviceId]);

        yield put(LoginFromGoogleAccountSuccess.action());

        if (action.meta) {
          yield call([action, action.meta?.deferred?.resolve], LoginFromGoogleAccountResult.Success);
        }
      } catch (e) {
        const error = e as AxiosError;

        const result = mapError(error);

        if (action.meta) {
          yield call([action, action.meta?.deferred?.reject], result);
        }
      }
    };
  }

  static get httpRequest() {
    return authRequestFactory<AxiosResponse<ISecurityTokens>, ISignInFromGoogleRequest>(
      MAIN_API.LOGIN_FROM_GOOGLE_ACCOUNT,
      HttpRequestMethod.Post,
    );
  }
}
