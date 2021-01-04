import { AxiosResponse } from 'axios';
import produce from 'immer';
import { SagaIterator } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import { authRequestFactory } from 'app/store/common/http-factory';

import { Login } from 'app/store/auth/features/login/login';
import { Meta } from 'store/common/actions';
import { HttpRequestMethod } from 'store/common/models';
import { ConfirmPhoneFailure } from './confirm-phone-failure';
import { IAuthState } from '../../models';
import { ConfirmPhoneRegistrationAllowed } from './confirm-phone-registration-allowed';
import { IConfirmProneApiRequest } from './api-requests/confirm-phone-api-request';
import { IConfirmPhoneApiResponse } from './api-requests/confirm-phone-api-response';
import { ILoginApiRequest } from './api-requests/login-api-request';
import { ILoginApiResponse } from './api-requests/login-api-response';
import { ISubscribeToPushNotificationsApiRequest } from './api-requests/subscribe-to-push-notifications-api-request';
import { IConfirmPhoneActionPayload } from './action-payloads/confirm-phone-action-payload';

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
      login: authRequestFactory<AxiosResponse<ILoginApiResponse>, ILoginApiRequest>(`${process.env.MAIN_API}/api/users/tokens`, HttpRequestMethod.Post),
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
