import { AuthService } from 'app/services/auth-service';
import produce from 'immer';
import { SagaIterator } from 'redux-saga';
import { createAction } from 'typesafe-actions';
import { IAuthState } from '../../models';
import { IRefreshTokenSuccessActionPayload } from './action-payloads/refresh-token-success-action-payload';

export class RefreshTokenSuccess {
  static get action() {
    return createAction('REFRESH_TOKEN_SUCCESS')<IRefreshTokenSuccessActionPayload>();
  }

  static get reducer() {
    return produce((draft: IAuthState, { payload }: ReturnType<typeof RefreshTokenSuccess.action>) => {
      draft.refreshTokenRequestLoading = false;
      draft.isAuthenticated = true;
      draft.securityTokens = payload;
      return draft;
    });
  }

  static get saga() {
    return function* (action: ReturnType<typeof RefreshTokenSuccess.action>): SagaIterator {
      new AuthService().initialize(action.payload);
    };
  }
}
