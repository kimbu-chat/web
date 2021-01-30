import { HTTPStatusCode } from 'app/common/http-status-code';
import { createEmptyDefferedAction } from 'app/store/common/actions';
import { authRequestFactory, HttpRequestMethod } from 'app/store/common/http';

import { AxiosResponse } from 'axios';
import produce from 'immer';
import { SagaIterator } from 'redux-saga';
import { call, put, select } from 'redux-saga/effects';
import { IAuthState } from '../../auth-state';
import { getAuthPhoneNumberSelector } from '../../selectors';
import { SendSmsCodeFailure } from './send-sms-code-failure';
import { SendSmsCodeSuccess } from './send-sms-code-success';

export class ReSendSmsCode {
  static get action() {
    return createEmptyDefferedAction('RE_SEND_PHONE_CONFIRMATION_CODE');
  }

  static get reducer() {
    return produce((draft: IAuthState) => ({
      ...draft,
      loading: true,
      isConfirmationCodeWrong: false,
    }));
  }

  static get saga() {
    return function* sendSmsPhoneConfirmationCodeSaga(action: ReturnType<typeof ReSendSmsCode.action>): SagaIterator {
      const phoneNumber = yield select(getAuthPhoneNumberSelector);

      const { httpRequest } = ReSendSmsCode;
      const { data, status } = httpRequest.call(yield call(() => httpRequest.generator({ phoneNumber })));

      if (status !== HTTPStatusCode.OK) {
        yield put(SendSmsCodeFailure.action());
        return;
      }

      yield put(SendSmsCodeSuccess.action(data));
      action?.meta.deferred.resolve();
    };
  }

  static get httpRequest() {
    return authRequestFactory<AxiosResponse<string>, { phoneNumber: string }>(
      `${process.env.MAIN_API}/api/users/send-sms-confirmation-code`,
      HttpRequestMethod.Post,
    );
  }
}
