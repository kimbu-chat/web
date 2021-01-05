import { Meta } from 'app/store/common/actions';
import { authRequestFactory } from 'app/store/common/http-factory';
import { HttpRequestMethod } from 'app/store/models';

import { AxiosResponse } from 'axios';
import produce from 'immer';
import { SagaIterator } from 'redux-saga';
import { call, select } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import { IAuthState } from '../../models';
import { getAuthPhoneNumberSelector, getConfirmationCodeSelector, getTwoLetterCountryCodeSelector } from '../../selectors';
import { Login } from '../login/login';
import { IRegisterActionPayload } from './action-payloads/register-action-payload';
import { IRegisterApiRequest } from './api-requests/register-api-request';

export class Register {
  static get action() {
    return createAction('REGISTER')<IRegisterActionPayload, Meta>();
  }

  static get reducer() {
    return produce((draft: IAuthState) => ({
      ...draft,
      loading: true,
    }));
  }

  static get saga() {
    return function* (action: ReturnType<typeof Register.action>): SagaIterator {
      const { firstName, lastName, nickname, avatarId } = action.payload;

      const phoneNumber = yield select(getAuthPhoneNumberSelector);

      const twoLetterCountryCode = yield select(getTwoLetterCountryCodeSelector);

      const confirmationCode = yield select(getConfirmationCodeSelector);

      yield call(() => Register.httpRequest.generator({ firstName, lastName, nickname, phoneNumber, twoLetterCountryCode, avatarId }));

      yield call(Login.saga, { phoneNumber, code: confirmationCode });

      action.meta.deferred.resolve();
    };
  }

  static get httpRequest() {
    return authRequestFactory<AxiosResponse, IRegisterApiRequest>(`${process.env.MAIN_API}/api/users/`, HttpRequestMethod.Post);
  }
}
