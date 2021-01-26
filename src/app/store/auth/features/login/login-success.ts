import { AuthService } from 'app/services/auth-service';
import produce from 'immer';
import { SagaIterator } from 'redux-saga';
import { createAction } from 'typesafe-actions';
import { IAuthState } from '../../models';
import { ILoginSuccessActionPayload } from './action-payloads/login-success-action-payload';

export class LoginSuccess {
  static get action() {
    return createAction('LOGIN_SUCCESS')<ILoginSuccessActionPayload>();
  }

  static get reducer() {
    return produce((draft: IAuthState, { payload }: ReturnType<typeof LoginSuccess.action>) => ({
      ...draft,
      isAuthenticated: true,
      loading: false,
      securityTokens: payload,
    }));
  }

  static get saga() {
    return function* (action: ReturnType<typeof LoginSuccess.action>): SagaIterator {
      new AuthService().initialize(action.payload);
    };
  }
}
