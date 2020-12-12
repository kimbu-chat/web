import { HTTPStatusCode } from 'app/common/http-status-code';
import { authRequestFactory } from 'app/store/common/http-factory';
import { HttpRequestMethod } from 'app/store/common/models';
import { ApiBasePath } from 'app/store/root-api';
import { AxiosResponse } from 'axios';
import produce from 'immer';
import { SagaIterator } from 'redux-saga';
import { put, call, select } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import { Meta } from '../../../common/actions';
import { AuthState } from '../../models';
import { getAuthPhoneNumber } from '../../selectors';
import { SendSmsCodeFailure } from './send-sms-code-failure';
import { SendSmsCodeSuccess } from './send-sms-code-success';

export class ReSendSmsCode {
  static get action() {
    return createAction('RE_SEND_PHONE_CONFIRMATION_CODE')<undefined, Meta>();
  }

  static get reducer() {
    return produce((draft: AuthState) => ({
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
      `${ApiBasePath.MainApi}/api/users/send-sms-confirmation-code`,
      HttpRequestMethod.Post,
    );
  }
}
