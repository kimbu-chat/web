import { AxiosError, AxiosResponse } from 'axios';
import { ISendSmsCodeRequest } from 'kimbu-models';
import { SagaIterator } from 'redux-saga';
import { call, put } from 'redux-saga/effects';

import { MAIN_API } from '@common/paths';
import { createDeferredAction } from '@store/common/actions';
import { authRequestFactory } from '@store/common/http/auth-request-factory';
import { HttpRequestMethod } from '@store/common/http/http-request-method';
import { mapAxiosErrorToApplicationError } from '@utils/error-utils';

import { ISendSmsCodeActionPayload } from './action-payloads/send-sms-code-action-payload';
import { SendSmsCodeFailure } from './send-sms-code-failure';
import { SendSmsCodeSuccess } from './send-sms-code-success';

import type { ILoginState } from '@store/login/login-state';

export class SendSmsCode {
  static get action() {
    return createDeferredAction<ISendSmsCodeActionPayload>('SEND_PHONE_CONFIRMATION_CODE');
  }

  static get reducer() {
    return (draft: ILoginState, { payload }: ReturnType<typeof SendSmsCode.action>) => {
      draft.loading = true;
      draft.isConfirmationCodeWrong = false;
      draft.phoneNumber = payload.phoneNumber;
      draft.loginSource = 'phone-number';
    };
  }

  static get saga() {
    return function* sendSmsPhoneConfirmationCodeSaga(action: ReturnType<typeof SendSmsCode.action>): SagaIterator {
      try {
        SendSmsCode.httpRequest.call(
          yield call(() =>
            SendSmsCode.httpRequest.generator({
              phoneNumber: action.payload.phoneNumber,
            }),
          ),
        );

        yield put(SendSmsCodeSuccess.action());

        yield call(() => action.meta?.deferred?.resolve());
      } catch (e) {
        yield put(SendSmsCodeFailure.action());
        if (e instanceof AxiosError) {
          const applicationError = mapAxiosErrorToApplicationError(e);
          yield call(() => action.meta?.deferred?.reject(applicationError));
        }
      }
    };
  }

  static get httpRequest() {
    return authRequestFactory<AxiosResponse<string>, ISendSmsCodeRequest>(MAIN_API.SEND_SMS_CODE, HttpRequestMethod.Post);
  }
}
