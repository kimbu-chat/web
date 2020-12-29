import { AuthService } from 'app/services/auth-service';
import { MyProfileService } from 'app/services/my-profile-service';
import { UserStatus } from 'app/store/common/models';
import { Init } from 'app/store/initiation/features/init/init';
import { initializeSaga } from 'app/store/initiation/sagas';
import { GetMyProfile } from 'app/store/my-profile/features/get-my-profile/get-my-profile';
import { GetMyProfileSuccess } from 'app/store/my-profile/features/get-my-profile/get-my-profile-success';
import { UserPreview } from 'app/store/my-profile/models';
import { AxiosResponse } from 'axios';
import jwt_decode from 'jwt-decode';
import { SagaIterator } from 'redux-saga';
import { call, fork, put } from 'redux-saga/effects';
import { getPushNotificationTokens } from '../../get-push-notification-tokens';
import { LoginResponse, PhoneConfirmationData, SecurityTokens } from '../../models';
import { ConfirmPhone } from '../confirm-phone/confirm-phone';
import { LoginSuccess } from '../logout/login-sucess/login-success';

export class Login {
  static get saga() {
    return function* (loginData: PhoneConfirmationData): SagaIterator {
      const { data }: AxiosResponse<LoginResponse> = ConfirmPhone.httpRequest.login.call(yield call(() => ConfirmPhone.httpRequest.login.generator(loginData)));

      const profileService = new MyProfileService();
      const myProfile: UserPreview = {
        id: parseInt(jwt_decode<{ unique_name: string }>(data.accessToken).unique_name, 10),
        firstName: '',
        lastName: '',
        lastOnlineTime: new Date(),
        phoneNumber: '',
        nickname: '',
        status: UserStatus.Online,
      };
      yield put(GetMyProfileSuccess.action(myProfile));
      profileService.setMyProfile(myProfile);
      const securityTokens: SecurityTokens = {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      };

      const authService = new AuthService();
      authService.initialize(securityTokens);
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
