import { AxiosResponse } from 'axios';
import { HTTPStatusCode } from 'app/common/http-status-code';
import {
  sendSmsPhoneConfirmationCodeFailureAction,
  sendSmsPhoneConfirmationCodeAction,
  sendSmsPhoneConfirmationCodeSuccessAction,
  confirmPhoneAction,
  confirmPhoneFailureAction,
  getMyProfileSuccessAction,
  loginSuccessAction
} from './actions';
import { LoginApiResponse, UserAuthData, PhoneConfirmationApiResponse } from './types';
import { call, put } from 'redux-saga/effects';
import { sendSmsConfirmationCodeApi, loginApi, confirmPhoneApi, getUserProfileApi } from './api';
import { setToken } from 'app/api';
import jwtDecode from 'jwt-decode';
import { AuthService } from 'app/services/auth-service';
import { MyProfileService } from 'app/services/my-profile-service';
import { UserPreview } from '../contacts/types';
import { initSocketConnectionAction } from '../sockets/actions';
import { changeUserOnlineStatusAction } from '../user/actions';

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

function parseLoginResponse(loginResponse: LoginApiResponse): UserAuthData {
  const userAuthData: UserAuthData = {
    accessToken: loginResponse.accessToken,
    userId: parseInt(jwtDecode<{ unique_name: string }>(loginResponse.accessToken).unique_name, 10),
    refreshToken: loginResponse.refreshToken
  };
  return userAuthData;
}

export function* authenticateSaga(action: ReturnType<typeof confirmPhoneAction>): Iterator<any> {
  // @ts-ignore
  const response: AxiosResponse<LoginApiResponse> = yield call(loginApi, action.payload);
  const parsedData = parseLoginResponse(response.data);
  const authService = new AuthService();
  authService.initialize(parsedData);
  yield put(loginSuccessAction(parsedData));
  yield call(initializeSaga);
  yield action?.deferred?.resolve();
}

export function* initializeSaga(): any {
  const authService = new AuthService();
  const authData = authService.auth;

  if (!authData) {
    return;
  }

  yield put(initSocketConnectionAction());
  yield put(changeUserOnlineStatusAction(true));

  setToken(authData.accessToken);

  const currentUserId = authData.userId;

  const profileService = new MyProfileService();
  const userProfile = profileService.myProfile;

  if (userProfile) {
    yield put(getMyProfileSuccessAction(userProfile));
    return;
  }

  const { data }: AxiosResponse<UserPreview> = yield call(getUserProfileApi, currentUserId);

  profileService.setMyProfile(data);

  yield put(getMyProfileSuccessAction(data));
}
