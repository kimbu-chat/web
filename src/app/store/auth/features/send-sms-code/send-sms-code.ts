import { HTTPStatusCode } from 'app/common/http-status-code';
import { authRequestFactory } from 'app/store/common/http-factory';
import { HttpRequestMethod } from 'app/store/common/models';
import { ApiBasePath } from 'app/store/root-api';
import { AxiosResponse } from 'axios';
import produce from 'immer';
import { SagaIterator } from 'redux-saga';
import { put, call } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import { Meta } from '../../../common/actions';
import { AuthState } from '../../models';
import { SendSmsCodeActionPayload } from './send-sms-code-action-payload';
import { SendSmsCodeFailure } from './send-sms-code-failure';
import { SendSmsCodeSuccess } from './send-sms-code-success';

export class SendSmsCode {
  static get action() {
    return createAction('SEND_PHONE_CONFIRMATION_CODE')<SendSmsCodeActionPayload, Meta>();
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
      const { data, status }: AxiosResponse<string> = SendSmsCode.httpRequest.call(
        yield call(() => SendSmsCode.httpRequest.generator({ phoneNumber: action.payload.phoneNumber })),
      );

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
