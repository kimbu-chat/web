import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { AuthState } from '../../../models';
import { LoginSuccessActionPayload } from './login-success-action-payload';

export class LoginSuccess {
  static get action() {
    return createAction('LOGIN_SUCCESS')<LoginSuccessActionPayload>();
  }

  static get reducer() {
    return produce((draft: AuthState, { payload }: ReturnType<typeof LoginSuccess.action>) => ({
      ...draft,
      isAuthenticated: true,
      loading: false,
      securityTokens: payload,
    }));
  }
}
