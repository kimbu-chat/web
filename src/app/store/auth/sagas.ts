import { AxiosResponse } from 'axios';
import { HTTPStatusCode } from 'app/common/http-status-code';
import {
  sendSmsPhoneConfirmationCodeFailureAction,
  sendSmsPhoneConfirmationCodeAction,
  sendSmsPhoneConfirmationCodeSuccessAction,
  confirmPhoneAction,
  confirmPhoneFailureAction
} from './actions';
import { LoginApiResponse, UserAuthData, PhoneConfirmationApiResponse } from './types';
import { call, put } from 'redux-saga/effects';
import { sendSmsConfirmationCodeApi, loginApi, confirmPhoneApi } from './api';
import { setToken } from 'app/api';
import jwtDecode from 'jwt-decode';

export function* sendSmsPhoneConfirmationCodeSaga(
  action: ReturnType<typeof sendSmsPhoneConfirmationCodeAction>
): Iterator<any> {
  // @ts-ignore
  const { data, status }: AxiosResponse<string> = yield call(sendSmsConfirmationCodeApi, action.payload.phoneNumber);
  if (status !== HTTPStatusCode.OK) {
    yield put(sendSmsPhoneConfirmationCodeFailureAction());
    alert('Sms Limit');
    return;
  }

  yield put(sendSmsPhoneConfirmationCodeSuccessAction(data));
  yield action?.deferred?.resolve(data);
}

export function setTokenAndSaveLoginResponse(loginResponse: LoginApiResponse): UserAuthData {
  setToken(loginResponse.accessToken);

  const userAuthData: UserAuthData = {
    accessToken: loginResponse.accessToken,
    userId: parseInt(jwtDecode<{ unique_name: string }>(loginResponse.accessToken).unique_name, 10),
    refreshToken: loginResponse.refreshToken
  };

  // todo: save userAuthData into local storage

  return userAuthData;
}

export function* confirmPhoneNumberSaga(action: ReturnType<typeof confirmPhoneAction>): Iterator<any> {
  // @ts-ignore
  const { data }: AxiosResponse<PhoneConfirmationApiResponse> = yield call(confirmPhoneApi, action.payload);
  if (data.isCodeCorrect && data.userExists) {
    yield call(authenticateSaga, action);
  } else if (data.isCodeCorrect && !data.userExists) {
    alert('User can be registered using mobile app');
    // yield put(confirmPhoneSuccessAction());
    // yield action?.deferred?.resolve();
  } else {
    yield put(confirmPhoneFailureAction());
  }
}

export function* authenticateSaga(action: ReturnType<typeof confirmPhoneAction>): Iterator<any> {
  // @ts-ignore
  const response: AxiosResponse<LoginApiResponse> = yield call(loginApi, action.payload);
  setTokenAndSaveLoginResponse(response.data);

  yield action?.deferred?.resolve();
}
