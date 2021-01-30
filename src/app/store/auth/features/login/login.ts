import { authRequestFactory, HttpRequestMethod } from 'app/store/common/http';
import { IUser } from 'app/store/common/models';
import { GetMyProfileSuccess } from 'app/store/my-profile/features/get-my-profile/get-my-profile-success';
import { AxiosResponse } from 'axios';
import jwt_decode from 'jwt-decode';
import { SagaIterator } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import { AppInit } from 'app/store/initiation/features/app-init/app-init';
import { ILoginApiRequest } from './api-requests/login-api-request';
import { ILoginApiResponse } from './api-requests/login-api-response';
import { ILoginActionPayload } from './action-payloads/login-action-payload';
import { LoginSuccess } from './login-success';
import { ICustomJwtPayload } from './models/custom-jwt-payload';
import { SubscribeToPushNotifications } from '../subscribe-to-push-notifications/subscribe-to-push-notifications';

export class Login {
  static get action() {
    return createAction('LOGIN')<ILoginActionPayload>();
  }

  static get saga() {
    return function* (action: ReturnType<typeof Login.action>): SagaIterator {
      const loginHttpRequest = Login.httpRequest;

      const { data } = loginHttpRequest.call(yield call(() => loginHttpRequest.generator(action.payload)));

      const userProfile: IUser = JSON.parse(jwt_decode<ICustomJwtPayload>(data.accessToken).profile);

      yield put(GetMyProfileSuccess.action(userProfile));
      yield put(LoginSuccess.action(data));
      yield put(SubscribeToPushNotifications.action());
      yield put(AppInit.action());
    };
  }

  static get httpRequest() {
    return authRequestFactory<AxiosResponse<ILoginApiResponse>, ILoginApiRequest>(`${process.env.MAIN_API}/api/users/tokens`, HttpRequestMethod.Post);
  }
}
