import { createAction } from '@reduxjs/toolkit';
import { ISecurityTokens } from 'kimbu-models';
import { SagaIterator } from 'redux-saga';
import { apply } from 'redux-saga/effects';

import { AuthService } from '../../../../services/auth-service';
import { IAuthState } from '../../auth-state';

interface AuthInitPayload {
  securityTokens: ISecurityTokens;
  deviceId: string;
}

export class AuthInit {
  static get action() {
    return createAction<AuthInitPayload>('AUTH_INIT');
  }

  static get reducer() {
    return (draft: IAuthState, { payload }: ReturnType<typeof AuthInit.action>) => {
      draft.isAuthenticated = true;
      draft.loading = false;
      draft.securityTokens = payload.securityTokens;
      draft.deviceId = payload.deviceId;
    };
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
