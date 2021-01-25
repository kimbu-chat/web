import { AxiosResponse } from 'axios';
import produce from 'immer';
import { SagaIterator } from 'redux-saga';
import { call, put, take } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import { authRequestFactory } from 'app/store/common/http-factory';

import { Login } from 'app/store/auth/features/login/login';
import { Meta } from 'store/common/actions';
import { HttpRequestMethod } from 'app/store/models';
import { ConfirmPhoneFailure } from './confirm-phone-failure';
import { IAuthState } from '../../models';
import { ConfirmPhoneRegistrationAllowed } from './confirm-phone-registration-allowed';
import { IConfirmProneApiRequest } from './api-requests/confirm-phone-api-request';
import { IConfirmPhoneApiResponse } from './api-requests/confirm-phone-api-response';
import { ISubscribeToPushNotificationsApiRequest } from './api-requests/subscribe-to-push-notifications-api-request';
import { IConfirmPhoneActionPayload } from './action-payloads/confirm-phone-action-payload';
import { LoginSuccess } from '../login/login-success';

export class ConfirmPhone {
  static get action() {
    return createAction('CONFIRM_PHONE')<IConfirmPhoneActionPayload, Meta | undefined>();
  }

  static get reducer() {
    return produce((draft: IAuthState) => {
      draft.loading = true;
      return draft;
    });
  }

  static get saga() {
    return function* confirmPhoneNumberSaga(action: ReturnType<typeof ConfirmPhone.action>): SagaIterator {
      const { data }: AxiosResponse<IConfirmPhoneApiResponse> = ConfirmPhone.httpRequest.confirmPhone.call(
        yield call(() => ConfirmPhone.httpRequest.confirmPhone.generator(action.payload)),
      );

      if (data.isCodeCorrect && data.userExists) {
        const { phoneNumber, code } = action.payload;
        yield put(Login.action({ phoneNumber, code }));
        yield take(LoginSuccess.action);
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
      confirmPhone: authRequestFactory<AxiosResponse<IConfirmPhoneApiResponse>, IConfirmProneApiRequest>(
        `${process.env.MAIN_API}/api/users/verify-sms-code`,
        HttpRequestMethod.Post,
      ),
      subscribeToPushNotifications: authRequestFactory<AxiosResponse, ISubscribeToPushNotificationsApiRequest>(
        `${process.env.NOTIFICATIONS_API}/api/notifications/subscribe`,
        HttpRequestMethod.Post,
      ),
    };
  }
}
