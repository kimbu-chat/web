import { AxiosResponse } from 'axios';
import { SagaIterator } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import { HttpRequestMethod } from '@store/common/http/http-request-method';
import { HTTPStatusCode } from '@common/http-status-code';
import { Meta } from '@store/common/actions';

import { MAIN_API } from '@common/paths';

import { httpRequestFactory } from '@store/common/http';
import { ConfirmPhone } from '@store/auth/features/confirm-phone/confirm-phone';
import { IConfirmChangePhoneActionPayload } from './action-payloads/confirm-change-phone-action-payload';
import { IConfirmChangePhoneApiRequest } from './api-requests/confirm-change-phone-api-request';
import { ConfirmChangePhoneSuccess } from './confirm-change-phone-success';

export class ConfirmChangePhone {
  static get action() {
    return createAction('CONFIRM_CHANGE_PHONE')<IConfirmChangePhoneActionPayload, Meta>();
  }

  static get saga() {
    return function* confirmChangePhone(
      action: ReturnType<typeof ConfirmChangePhone.action>,
    ): SagaIterator {
      const { status: verifyStatus, data: verifyData } = yield call(() =>
        ConfirmPhone.httpRequest.generator({
          code: action.payload.confirmationCode,
          phoneNumber: action.payload.phoneNumber,
        }),
      );

      if (
        verifyStatus !== HTTPStatusCode.OK ||
        verifyData.userExists ||
        !verifyData.isCodeCorrect
      ) {
        action?.meta.deferred.reject();
        return;
      }

      const { status: changeStatus } = yield call(() =>
        ConfirmChangePhone.httpRequest.generator({
          ...action.payload,
          phoneNumber: action.payload.phoneNumber,
        }),
      );

      if (changeStatus !== HTTPStatusCode.OK) {
        action?.meta.deferred.reject();
        return;
      }

      action?.meta.deferred.resolve();
      yield put(ConfirmChangePhoneSuccess.action({ phoneNumber: action.payload.phoneNumber }));
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse, IConfirmChangePhoneApiRequest>(
      MAIN_API.CHANGE_PHONE,
      HttpRequestMethod.Put,
    );
  }
}
