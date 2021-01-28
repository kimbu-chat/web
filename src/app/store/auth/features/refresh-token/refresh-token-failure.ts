import produce from 'immer';
import { createEmptyAction } from 'store/common/actions';
import { IAuthState } from '../../models';

export class RefreshTokenFailure {
  static get action() {
    return createEmptyAction('REFRESH_TOKEN_FAILURE');
  }

  static get reducer() {
    return produce((draft: IAuthState) => {
      draft.refreshTokenRequestLoading = false;
      draft.isAuthenticated = false;
      return draft;
    });
  }
}
