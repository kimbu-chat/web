import { apply } from '@redux-saga/core/effects';
import produce from 'immer';
import { SagaIterator } from 'redux-saga';
import { createAction } from 'typesafe-actions';
import { AuthService } from '../../../../services/auth-service';
import { IAuthState } from '../../auth-state';
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
      securityTokens: payload.securityTokens,
      deviceId: payload.deviceId,
    }));
  }

  static get saga() {
    return function* loginSuccess(action: ReturnType<typeof LoginSuccess.action>): SagaIterator {
      const authService = new AuthService();
      yield apply(authService, authService.initialize, [
        action.payload.securityTokens,
        { deviceId: action.payload.deviceId },
      ]);
    };
  }
}
