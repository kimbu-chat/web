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
import { IAuthState, ILoginResponse, IPhoneConfirmationApiResponse, IPhoneConfirmationData, ISubscribeToPushNotificationsRequest } from '../../models';
import { IConfirmPhoneActionPayload } from './confirm-phone-action-payload';
import { ConfirmPhoneRegistrationAllowed } from './confirm-phone-registration-allowed';

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
      const { data }: AxiosResponse<IPhoneConfirmationApiResponse> = ConfirmPhone.httpRequest.confirmPhone.call(
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
      login: authRequestFactory<AxiosResponse<ILoginResponse>, IPhoneConfirmationData>(`${process.env.MAIN_API}/api/users/tokens`, HttpRequestMethod.Post),
      confirmPhone: authRequestFactory<AxiosResponse<IPhoneConfirmationApiResponse>, IPhoneConfirmationData>(
        `${process.env.MAIN_API}/api/users/verify-sms-code`,
        HttpRequestMethod.Post,
      ),
      subscribeToPushNotifications: authRequestFactory<AxiosResponse, ISubscribeToPushNotificationsRequest>(
        `${process.env.NOTIFICATIONS_API}/api/notifications/subscribe`,
        HttpRequestMethod.Post,
      ),
    };
  }
}
