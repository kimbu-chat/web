import { HTTPStatusCode } from 'app/common/http-status-code';
import { AxiosResponse } from 'axios';
import produce from 'immer';
import { SagaIterator } from 'redux-saga';
import { put, call } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import { Meta } from '../../common/actions';
import { AuthHttpRequests } from '../http-requests';
import { SendSmsCodeActionData, AuthState } from '../models';
import { SendSmsCodeFailure } from './send-sms-code-failure';
import { SendSmsCodeSuccess } from './send-sms-code-success';

export class SendSmsCode {
  static get action() {
    return createAction('SEND_PHONE_CONFIRMATION_CODE')<SendSmsCodeActionData, Meta>();
  }

  static get reducer() {
    return produce((draft: AuthState, { payload }: ReturnType<typeof SendSmsCode.action>) => ({
      ...draft,
      loading: true,
      isConfirmationCodeWrong: false,
      phoneNumber: payload.phoneNumber,
    }));
  }

  static get saga() {
    return function* sendSmsPhoneConfirmationCodeSaga(action: ReturnType<typeof SendSmsCode.action>): SagaIterator {
      const request = AuthHttpRequests.sendSmsConfirmationCode;
      const { data, status }: AxiosResponse<string> = request.call(yield call(() => request.generator({ phoneNumber: action.payload.phoneNumber })));

      if (status !== HTTPStatusCode.OK) {
        yield put(SendSmsCodeFailure.action());
        alert('Sms Limit');
        return;
      }

      yield put(SendSmsCodeSuccess.action(data));
      action?.meta.deferred.resolve();
    };
  }
}
