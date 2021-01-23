import { AuthService } from 'app/services/auth-service';
import { MyProfileService } from 'app/services/my-profile-service';
import { Init } from 'app/store/initiation/features/init/init';
import { initializeSaga } from 'app/store/initiation/sagas';
import { IUserPreview } from 'app/store/models';
import { GetMyProfile } from 'app/store/my-profile/features/get-my-profile/get-my-profile';
import { GetMyProfileSuccess } from 'app/store/my-profile/features/get-my-profile/get-my-profile-success';
import { AxiosResponse } from 'axios';
import jwt_decode from 'jwt-decode';
import { SagaIterator } from 'redux-saga';
import { call, fork, put } from 'redux-saga/effects';
import { getPushNotificationTokens } from '../../get-push-notification-tokens';
import { ISecurityTokens } from '../../models';
import { ILoginApiRequest } from '../confirm-phone/api-requests/login-api-request';
import { ILoginApiResponse } from '../confirm-phone/api-requests/login-api-response';
import { ConfirmPhone } from '../confirm-phone/confirm-phone';
import { LoginSuccess } from './login-success';
import { ICustomJwtPayload } from './models/custom-jwt-payload';

export class Login {
  static get saga() {
    return function* (loginData: ILoginApiRequest): SagaIterator {
      const { data }: AxiosResponse<ILoginApiResponse> = ConfirmPhone.httpRequest.login.call(
        yield call(() => ConfirmPhone.httpRequest.login.generator(loginData)),
      );
      // @ts-ignore
      const userProfile: IUserPreview = JSON.parse(jwt_decode<ICustomJwtPayload>(data.accessToken).profile);
      yield put(GetMyProfileSuccess.action(userProfile));
      new MyProfileService().setMyProfile(userProfile);
      const securityTokens: ISecurityTokens = {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      };

      new AuthService().initialize(securityTokens);
      yield put(LoginSuccess.action(securityTokens));
      yield put(Init.action());
      yield fork(initializeSaga);
      yield call(GetMyProfile.saga);
      const tokens = yield call(getPushNotificationTokens);
      if (tokens) {
        ConfirmPhone.httpRequest.subscribeToPushNotifications.call(yield call(() => ConfirmPhone.httpRequest.subscribeToPushNotifications.generator(tokens)));
      }
    };
  }
}
