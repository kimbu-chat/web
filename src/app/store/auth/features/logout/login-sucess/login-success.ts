import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { IAuthState } from '../../../models';
import { ILoginSuccessActionPayload } from './login-success-action-payload';

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
}
