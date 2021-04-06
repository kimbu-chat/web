import { AxiosResponse } from 'axios';
import produce from 'immer';
import { SagaIterator } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import { HttpRequestMethod } from '@store/common/http/http-request-method';
import { authRequestFactory } from '@store/common/http/auth-request-factory';
import { HTTPStatusCode } from '@common/http-status-code';
import { Meta } from '@store/common/actions';
import { IAuthState } from '@store/auth/auth-state';

import { MAIN_API } from '@common/paths';
import { ISendSmsCodeActionPayload } from './action-payloads/send-sms-code-action-payload';
import { SendSmsCodeFailure } from './send-sms-code-failure';
import { SendSmsCodeSuccess } from './send-sms-code-success';
import { ISendSmsCodeApiRequest } from './api-requests/send-sms-code-api-request';

export class SendSmsCode {
  static get action() {
    return createAction('SEND_PHONE_CONFIRMATION_CODE')<ISendSmsCodeActionPayload, Meta>();
  }

  static get reducer() {
    return produce((draft: IAuthState, { payload }: ReturnType<typeof SendSmsCode.action>) => ({
      ...draft,
      loading: true,
      isConfirmationCodeWrong: false,
      phoneNumber: payload.phoneNumber,
      twoLetterCountryCode: payload.twoLetterCountryCode,
    }));
  }

  static get saga() {
    return function* sendSmsPhoneConfirmationCodeSaga(
      action: ReturnType<typeof SendSmsCode.action>,
    ): SagaIterator {
      const { status }: AxiosResponse<string> = SendSmsCode.httpRequest.call(
        yield call(() =>
          SendSmsCode.httpRequest.generator({
            phoneNumber: action.payload.phoneNumber,
          }),
        ),
      );

      if (status !== HTTPStatusCode.OK) {
        yield put(SendSmsCodeFailure.action());
        action?.meta.deferred.reject();
        return;
      }

      yield put(SendSmsCodeSuccess.action());
      action?.meta.deferred.resolve();
    };
  }

  static get httpRequest() {
    return authRequestFactory<AxiosResponse<string>, ISendSmsCodeApiRequest>(
      MAIN_API.SEND_SMS_CODE,
      HttpRequestMethod.Post,
    );
  }
}
