import { AxiosResponse } from 'axios';
import jwtDecode from 'jwt-decode';
import { SagaIterator } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import { authRequestFactory, HttpRequestMethod } from '@store/common/http';
import { AppInit } from '@store/initiation/features/app-init/app-init';
import { IUser } from '@store/common/models';
import { GetMyProfileSuccess } from '@store/my-profile/features/get-my-profile/get-my-profile-success';
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
    return function* login(action: ReturnType<typeof Login.action>): SagaIterator {
      const loginHttpRequest = Login.httpRequest;

      const { data } = loginHttpRequest.call(
        yield call(() => loginHttpRequest.generator(action.payload)),
      );

      const decodedJwt = jwtDecode<ICustomJwtPayload>(data.accessToken);

      const profile: IUser = JSON.parse(decodedJwt.profile);
      const deviceId = decodedJwt.device;

      yield put(
        GetMyProfileSuccess.action({
          user: profile,
        }),
      );

      yield put(LoginSuccess.action({ securityTokens: data, deviceId }));
      yield put(SubscribeToPushNotifications.action());
      yield put(AppInit.action());
    };
  }

  static get httpRequest() {
    return authRequestFactory<AxiosResponse<ILoginApiResponse>, ILoginApiRequest>(
      `${process.env.REACT_APP_MAIN_API}/api/users/tokens`,
      HttpRequestMethod.Post,
    );
  }
}
