import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { AuthState, LoginResponse } from '../../models';

export class LoginSuccess {
  static get action() {
    return createAction('LOGIN_SUCCESS')<LoginResponse>();
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
