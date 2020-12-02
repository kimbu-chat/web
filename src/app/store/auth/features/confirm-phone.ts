import { AuthService } from 'app/services/auth-service';
import { MyProfileService } from 'app/services/my-profile-service';
import { AxiosResponse } from 'axios';
import produce from 'immer';
import jwt_decode from 'jwt-decode';
import { SagaIterator } from 'redux-saga';
import { put, call, fork } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import { Meta } from '../../common/actions';
import { UserStatus } from '../../common/models';
import { InitActions } from '../../initiation/actions';
import { MyProfileActions } from '../../my-profile/actions';
import { UserPreview } from '../../my-profile/models';
import { ConfirmPhoneFailure } from './confirm-phone-failure';
import { LoginSuccess } from './login-success';
import { AuthState, LoginResponse, PhoneConfirmationActionData, PhoneConfirmationApiResponse, SecurityTokens } from '../models';
import { AuthHttpRequests } from '../http-requests';
import { initializeSaga } from '../../initiation/sagas';
import { getMyProfileSaga } from '../../my-profile/sagas';
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
      const request = AuthHttpRequests.confirmPhone;
      const { data }: AxiosResponse<PhoneConfirmationApiResponse> = request.call(yield call(() => request.generator(action.payload)));

      if (data.isCodeCorrect && data.userExists) {
        const request = AuthHttpRequests.login;
        const { data }: AxiosResponse<LoginResponse> = request.call(yield call(() => request.generator(action.payload)));

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
        yield put(MyProfileActions.getMyProfileSuccessAction(myProfile));
        profileService.setMyProfile(myProfile);
        const securityTokens: SecurityTokens = {
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        };

        const authService = new AuthService();
        authService.initialize(securityTokens);
        yield put(LoginSuccess.action(securityTokens));
        yield put(InitActions.init());
        yield fork(initializeSaga);
        yield call(getMyProfileSaga);
        const tokens = yield call(getPushNotificationTokens);
        const httpRequest = AuthHttpRequests.subscribeToPushNotifications;
        httpRequest.call(yield call(() => httpRequest.generator(tokens)));
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
}
