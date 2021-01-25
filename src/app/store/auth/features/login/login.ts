import { AuthService } from 'app/services/auth-service';
import { MyProfileService } from 'app/services/my-profile-service';
import { authRequestFactory } from 'app/store/common/http-factory';
import { Init } from 'app/store/initiation/features/init/init';
import { HttpRequestMethod, IUserPreview } from 'app/store/models';
import { GetMyProfileSuccess } from 'app/store/my-profile/features/get-my-profile/get-my-profile-success';
import { AxiosResponse } from 'axios';
import jwt_decode from 'jwt-decode';
import { SagaIterator } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import { InitSocketConnection } from 'app/store/sockets/features/init-socked-connection/init-socket-connection';
import { SettingsActions } from 'app/store/settings/actions';
import { ChangeUserOnlineStatus } from 'app/store/my-profile/features/change-user-online-status/change-user-online-status';
import { StartIdleWatcher } from 'app/store/initiation/features/start-idle-watcher/start-idle-watcher';
import { StartInternetConnectionStateChangeWatcher } from 'app/store/internet/features/internet-connection-check/start-internet-connection-state-change-watcher';
import { getPushNotificationTokens } from '../../get-push-notification-tokens';
import { ISecurityTokens } from '../../models';
import { ILoginApiRequest } from './api-requests/login-api-request';
import { ILoginApiResponse } from './api-requests/login-api-response';
import { ConfirmPhone } from '../confirm-phone/confirm-phone';
import { ILoginActionPayload } from './action-payloads/login-action-payload';
import { LoginSuccess } from './login-success';
import { ICustomJwtPayload } from './models/custom-jwt-payload';

export class Login {
  static get action() {
    return createAction('LOGIN')<ILoginActionPayload>();
  }

  static get saga() {
    return function* (action: ReturnType<typeof Login.action>): SagaIterator {
      const loginHttpRequest = Login.httpRequest;

      const { data }: AxiosResponse<ILoginApiResponse> = loginHttpRequest.call(yield call(() => loginHttpRequest.generator(action.payload)));
      // @ts-ignore
      const userProfile: IUserPreview = JSON.parse(jwt_decode<ICustomJwtPayload>(data.accessToken).profile);
      yield put(GetMyProfileSuccess.action(userProfile));
      new MyProfileService().setMyProfile(userProfile);
      const securityTokens: ISecurityTokens = {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      };
      yield put(LoginSuccess.action(securityTokens));
      new AuthService().initialize(securityTokens);
      yield put(Init.action());
      const tokens = yield call(getPushNotificationTokens);
      if (tokens) {
        ConfirmPhone.httpRequest.subscribeToPushNotifications.call(yield call(() => ConfirmPhone.httpRequest.subscribeToPushNotifications.generator(tokens)));
      }

      yield put(ChangeUserOnlineStatus.action(true));
      yield put(InitSocketConnection.action());
      yield put(SettingsActions.getUserSettingsAction());
      yield put(StartInternetConnectionStateChangeWatcher.action());
      yield put(StartIdleWatcher.action());
    };
  }

  static get httpRequest() {
    return authRequestFactory<AxiosResponse<ILoginApiResponse>, ILoginApiRequest>(`${process.env.MAIN_API}/api/users/tokens`, HttpRequestMethod.Post);
  }
}
