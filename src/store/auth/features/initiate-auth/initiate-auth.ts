import { apply } from 'redux-saga/effects';
import produce from 'immer';
import { SagaIterator } from 'redux-saga';
import { createAction } from 'typesafe-actions';

import { ISecurityTokens } from '@store/auth/common/models';

import { AuthService } from '../../../../services/auth-service';
import { IAuthState } from '../../auth-state';

interface AuthInitPayload {
  securityTokens: ISecurityTokens;
  deviceId: string;
}

export class AuthInit {
  static get action() {
    return createAction('AUTH_INIT')<AuthInitPayload>();
  }

  static get reducer() {
    return produce((draft: IAuthState, { payload }: ReturnType<typeof AuthInit.action>) => ({
      ...draft,
      isAuthenticated: true,
      loading: false,
      securityTokens: payload.securityTokens,
      deviceId: payload.deviceId,
    }));
  }

  static get saga() {
    return function* initiateTokens(action: ReturnType<typeof AuthInit.action>): SagaIterator {
      const authService = new AuthService();
      yield apply(authService, authService.initialize, [
        action.payload.securityTokens,
        action.payload.deviceId,
      ]);
    };
  }
}