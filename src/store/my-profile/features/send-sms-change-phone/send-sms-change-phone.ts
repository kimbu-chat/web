import { AxiosResponse } from 'axios';
import { SagaIterator } from 'redux-saga';
import { call } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';

import { HTTPStatusCode } from '@common/http-status-code';
import { Meta } from '@store/common/actions';
import { SendSmsCode } from '@store/login/features/send-sms-code/send-sms-code';

import { ISendSmsChangePhoneActionPayload } from './action-payloads/send-sms-code-action-payload';

export class SendSmsChangePhone {
  static get action() {
    return createAction('SEND_SMS_CHANGE_PHONE')<ISendSmsChangePhoneActionPayload, Meta>();
  }

  static get saga() {
    return function* sendSmsChangePhone(
      action: ReturnType<typeof SendSmsChangePhone.action>,
    ): SagaIterator {
      const { status: codeStatus }: AxiosResponse<string> = yield call(() =>
        SendSmsCode.httpRequest.generator({
          phoneNumber: action.payload.phone,
        }),
      );

      if (codeStatus !== HTTPStatusCode.OK) {
        action?.meta.deferred.reject();
        return;
      }

      action?.meta.deferred.resolve();
    };
  }
}
