import { AuthService } from 'app/services/auth-service';
import { MyProfileService } from 'app/services/my-profile-service';
import { Meta } from 'app/store/common/actions';
import { authRequestFactory } from 'app/store/common/http-factory';
import { HttpRequestMethod, UserStatus } from 'app/store/common/models';
import { Init } from 'app/store/initiation/features/init/init';
import { initializeSaga } from 'app/store/initiation/sagas';
import { GetMyProfile } from 'app/store/my-profile/features/get-my-profile/get-my-profile';
import { GetMyProfileSuccess } from 'app/store/my-profile/features/get-my-profile/get-my-profile-success';
import { UserPreview } from 'app/store/my-profile/models';
import { ApiBasePath } from 'app/store/root-api';
import { AxiosResponse } from 'axios';
import produce from 'immer';
import jwt_decode from 'jwt-decode';
import { SagaIterator } from 'redux-saga';
import { call, fork, put, select } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import { getPushNotificationTokens } from '../../get-push-notification-tokens';
import { AuthState, LoginResponse, RegisterApiRequest, SecurityTokens } from '../../models';
import { getAuthPhoneNumber, getConfirmationCode, getTwoLetterCountryCode } from '../../selectors';
import { ConfirmPhone } from '../confirm-phone/confirm-phone';
import { LoginSuccess } from '../logout/login-sucess/login-success';
import { RegisterActionPayload } from './register-action-payload';

export class Register {
  static get action() {
    return createAction('REGISTER')<RegisterActionPayload, Meta>();
  }

  static get reducer() {
    return produce((draft: AuthState) => ({
      ...draft,
      loading: true,
    }));
  }

  static get saga() {
    return function* (action: ReturnType<typeof Register.action>): SagaIterator {
      const { firstName, lastName, nickname, avatarId } = action.payload;

      const phoneNumber = yield select(getAuthPhoneNumber);

      const twoLetterCountryCode = yield select(getTwoLetterCountryCode);

      const confirmationCode = yield select(getConfirmationCode);

      yield call(() => Register.httpRequest.generator({ firstName, lastName, nickname, phoneNumber, twoLetterCountryCode, avatarId }));

      const { data }: AxiosResponse<LoginResponse> = ConfirmPhone.httpRequest.login.call(
        yield call(() => ConfirmPhone.httpRequest.login.generator({ phoneNumber, code: confirmationCode })),
      );

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
      action?.meta?.deferred?.resolve();

      action.meta.deferred.resolve();
    };
  }

  static get httpRequest() {
    return authRequestFactory<AxiosResponse, RegisterApiRequest>(`${ApiBasePath.MainApi}/api/users/`, HttpRequestMethod.Post);
  }
}
