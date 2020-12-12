import { AxiosResponse } from 'axios';
import produce from 'immer';
import { SagaIterator } from 'redux-saga';
import { put, call } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import { authRequestFactory } from 'app/store/common/http-factory';
import { ApiBasePath } from 'app/store/root-api';
import { Login } from 'app/store/auth/features/login/login';
import { Meta } from '../../../common/actions';
import { HttpRequestMethod } from '../../../common/models';
import { ConfirmPhoneFailure } from './confirm-phone-failure';
import { AuthState, LoginResponse, PhoneConfirmationApiResponse, PhoneConfirmationData, SubscribeToPushNotificationsRequest } from '../../models';
import { ConfirmPhoneActionPayload } from './confirm-phone-action-payload';
import { ConfirmPhoneRegistrationAllowed } from './confirm-phone-registration-allowed';

export class ConfirmPhone {
  static get action() {
    return createAction('CONFIRM_PHONE')<ConfirmPhoneActionPayload, Meta | undefined>();
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
        yield call(Login.saga, action.payload);
        action?.meta?.deferred?.resolve({ userRegistered: true });
      } else if (data.isCodeCorrect && !data.userExists) {
        yield put(ConfirmPhoneRegistrationAllowed.action({ confirmationCode: action.payload.code }));
        action?.meta?.deferred.resolve({ userRegistered: false });
      } else {
        action?.meta?.deferred.reject();
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
