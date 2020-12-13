import { Meta } from 'app/store/common/actions';
import { authRequestFactory } from 'app/store/common/http-factory';
import { HttpRequestMethod } from 'app/store/common/models';
import { ApiBasePath } from 'app/store/root-api';
import { AxiosResponse } from 'axios';
import produce from 'immer';
import { SagaIterator } from 'redux-saga';
import { call, select } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import { AuthState, RegisterApiRequest } from '../../models';
import { getAuthPhoneNumber, getConfirmationCode, getTwoLetterCountryCode } from '../../selectors';
import { Login } from '../login/login';
import { RegisterActionPayload } from './register-action-payload';

export class Register {
  static get action() {
    return createAction('REGISTER')<RegisterActionPayload, Meta>();
  }

  static get reducer() {
    return produce((draft: AuthState) => ({
      ...draft,
      loading: true,
    }));
  }

  static get saga() {
    return function* (action: ReturnType<typeof Register.action>): SagaIterator {
      const { firstName, lastName, nickname, avatarId } = action.payload;

      const phoneNumber = yield select(getAuthPhoneNumber);

      const twoLetterCountryCode = yield select(getTwoLetterCountryCode);

      const confirmationCode = yield select(getConfirmationCode);

      yield call(() => Register.httpRequest.generator({ firstName, lastName, nickname, phoneNumber, twoLetterCountryCode, avatarId }));

      yield call(Login.saga, { phoneNumber, code: confirmationCode });

      action.meta.deferred.resolve();
    };
  }

  static get httpRequest() {
    return authRequestFactory<AxiosResponse, RegisterApiRequest>(`${ApiBasePath.MainApi}/api/users/`, HttpRequestMethod.Post);
  }
}
