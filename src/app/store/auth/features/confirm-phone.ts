import { AuthService } from 'app/services/auth-service';
import { MyProfileService } from 'app/services/my-profile-service';
import { AxiosResponse } from 'axios';
import produce from 'immer';
import jwt_decode from 'jwt-decode';
import { SagaIterator } from 'redux-saga';
import { put, call, fork } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import { authRequestFactory } from 'app/store/common/http-factory';
import { ApiBasePath } from 'app/store/root-api';
import { GetMyProfile } from 'app/store/my-profile/features/get-my-profile';
import { GetMyProfileSuccess } from 'app/store/my-profile/features/get-my-profile-success';
import { initializeSaga } from 'app/store/initiation/sagas';
import { Init } from 'app/store/initiation/features/init';
import { Meta } from '../../common/actions';
import { HttpRequestMethod, UserStatus } from '../../common/models';
import { UserPreview } from '../../my-profile/models';
import { ConfirmPhoneFailure } from './confirm-phone-failure';
import { LoginSuccess } from './login-success';
import {
  AuthState,
  LoginResponse,
  PhoneConfirmationActionData,
  PhoneConfirmationApiResponse,
  PhoneConfirmationData,
  SecurityTokens,
  SubscribeToPushNotificationsRequest,
} from '../models';
import { getPushNotificationTokens } from '../get-push-notification-tokens';

export class ConfirmPhone {
  static get action() {
    return createAction('CONFIRM_PHONE')<PhoneConfirmationActionData, Meta>();
  }

  static get reducer() {
    return produce((draft: AuthState) => {
      draft.loading = true;
      return draft;
    });
  }

  static get saga() {
    return function* confirmPhoneNumberSaga(action: ReturnType<typeof ConfirmPhone.action>): SagaIterator {
      const { data }: AxiosResponse<PhoneConfirmationApiResponse> = ConfirmPhone.httpRequest.confirmPhone.call(
        yield call(() => ConfirmPhone.httpRequest.confirmPhone.generator(action.payload)),
      );

      if (data.isCodeCorrect && data.userExists) {
        const { data }: AxiosResponse<LoginResponse> = ConfirmPhone.httpRequest.login.call(
          yield call(() => ConfirmPhone.httpRequest.login.generator(action.payload)),
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
        ConfirmPhone.httpRequest.subscribeToPushNotifications.call(yield call(() => ConfirmPhone.httpRequest.subscribeToPushNotifications.generator(tokens)));
        action?.meta.deferred?.resolve();
      } else if (data.isCodeCorrect && !data.userExists) {
        alert('User can be registered using mobile app');
        // yield put(confirmPhoneSuccessAction());
        action?.meta.deferred.resolve();
      } else {
        action?.meta.deferred.reject();
        yield put(ConfirmPhoneFailure.action());
      }
    };
  }

  static get httpRequest() {
    return {
      login: authRequestFactory<AxiosResponse<LoginResponse>, PhoneConfirmationData>(`${ApiBasePath.MainApi}/api/users/tokens`, HttpRequestMethod.Post),
      confirmPhone: authRequestFactory<AxiosResponse<PhoneConfirmationApiResponse>, PhoneConfirmationData>(
        `${ApiBasePath.MainApi}/api/users/verify-sms-code`,
        HttpRequestMethod.Post,
      ),
      subscribeToPushNotifications: authRequestFactory<AxiosResponse, SubscribeToPushNotificationsRequest>(
        `${ApiBasePath.NotificationsApi}/api/notifications/subscribe`,
        HttpRequestMethod.Post,
      ),
    };
  }
}
