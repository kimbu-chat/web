import { HTTPStatusCode } from 'app/common/http-status-code';
import { createEmptyDefferedAction } from 'app/store/common/actions';
import { authRequestFactory } from 'app/store/common/http-factory';
import { HttpRequestMethod } from 'app/store/common/models';

import { AxiosResponse } from 'axios';
import produce from 'immer';
import { SagaIterator } from 'redux-saga';
import { call, put, select } from 'redux-saga/effects';
import { IAuthState } from '../../models';
import { getAuthPhoneNumber } from '../../selectors';
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
      const phoneNumber = yield select(getAuthPhoneNumber);

      const { data, status }: AxiosResponse<string> = ReSendSmsCode.httpRequest.call(yield call(() => ReSendSmsCode.httpRequest.generator({ phoneNumber })));

      if (status !== HTTPStatusCode.OK) {
        yield put(SendSmsCodeFailure.action());
        alert('Sms Limit');
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
