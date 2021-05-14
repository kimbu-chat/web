import produce from 'immer';
import { SagaIterator } from 'redux-saga';
import { apply } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';

import { AuthService } from '../../../../services/auth-service';
import { IAuthState } from '../../auth-state';

import { IRefreshTokenSuccessActionPayload } from './action-payloads/refresh-token-success-action-payload';

export class RefreshTokenSuccess {
  static get action() {
    return createAction('REFRESH_TOKEN_SUCCESS')<IRefreshTokenSuccessActionPayload>();
  }

  static get reducer() {
    return produce(
      (draft: IAuthState, { payload }: ReturnType<typeof RefreshTokenSuccess.action>) => {
        draft.refreshTokenRequestLoading = false;
        draft.isAuthenticated = true;
        draft.securityTokens = payload;
        return draft;
      },
    );
  }

  static get saga() {
    return function* refreshTokenSuccess(
      action: ReturnType<typeof RefreshTokenSuccess.action>,
    ): SagaIterator {
      const authService = new AuthService();
      yield apply(authService, authService.initialize, [action.payload]);
    };
  }
}
