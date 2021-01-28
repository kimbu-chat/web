import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { IAuthState } from '../../models';
import { IRefreshTokenSuccessActionPayload } from './action-payloads/refresh-token-success-action-payload';

export class RefreshTokenSuccess {
  static get reducer() {
    return produce((draft: IAuthState) => {
      draft.refreshTokenRequestLoading = false;
      draft.isAuthenticated = true;
      return draft;
    });
  }

  static get action() {
    return createAction('REFRESH_TOKEN_SUCCESS')<IRefreshTokenSuccessActionPayload>();
  }
}
