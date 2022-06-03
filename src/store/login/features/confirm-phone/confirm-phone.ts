import { AxiosResponse } from 'axios';
import { IVerifySmsCodeResponse, IVerifySmsCodeRequest } from 'kimbu-models';
import { SagaIterator } from 'redux-saga';
import { call, put, take } from 'redux-saga/effects';

import { MAIN_API } from '@common/paths';
import { createDeferredAction } from '@store/common/actions';
import { authRequestFactory, HttpRequestMethod } from '@store/common/http';

import { ILoginState } from '../../login-state';
import { LoginSuccess } from '../login/login-success';
import { Login } from '../login/login';

import { IConfirmPhoneActionPayload } from './action-payloads/confirm-phone-action-payload';
import { ConfirmPhoneFailure } from './confirm-phone-failure';
import { ConfirmPhoneSuccess } from './confirm-phone-success';

export class ConfirmPhone {
  static get action() {
    return createDeferredAction<IConfirmPhoneActionPayload, boolean>('CONFIRM_PHONE');
  }

  static get reducer() {
    return (draft: ILoginState) => {
      draft.loading = true;
      return draft;
    };
  }

  static get saga() {
    return function* confirmPhoneNumberSaga(
      action: ReturnType<typeof ConfirmPhone.action>,
    ): SagaIterator {
      const { data } = ConfirmPhone.httpRequest.call(
        yield call(() => ConfirmPhone.httpRequest.generator(action.payload)),
      );

      if (data.isCodeCorrect && data.userExists) {
        const { phoneNumber, code } = action.payload;
        yield put(Login.action({ phoneNumber, code }));
        yield take(LoginSuccess.action);
        action?.meta?.deferred?.resolve(true);
      } else if (data.isCodeCorrect && !data.userExists) {
        yield put(ConfirmPhoneSuccess.action({ confirmationCode: action.payload.code }));
        action?.meta?.deferred.resolve(false);
      } else {
        action?.meta?.deferred.reject();
        yield put(ConfirmPhoneFailure.action());
      }
    };
  }

  static get httpRequest() {
    return authRequestFactory<AxiosResponse<IVerifySmsCodeResponse>, IVerifySmsCodeRequest>(
      MAIN_API.VERIFY_SMS_CODE,
      HttpRequestMethod.Post,
    );
  }
}
