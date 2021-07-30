import produce from 'immer';
import { SagaIterator } from 'redux-saga';
import { apply } from 'redux-saga/effects';

import { AuthService } from '@services/auth-service';
import { createEmptyAction } from '@store/common/actions';

import { MyProfileService } from '../../../../services/my-profile-service';
import { IAuthState } from '../../auth-state';

export class RefreshTokenFailure {
  static get action() {
    return createEmptyAction('REFRESH_TOKEN_FAILURE');
  }

  static get reducer() {
    return produce((draft: IAuthState) => {
      draft.refreshTokenRequestLoading = false;
      draft.isAuthenticated = false;
      draft.securityTokens = undefined;
      return draft;
    });
  }

  static get saga() {
    return function* refTokenFailure(): SagaIterator {
      const authService = new AuthService();
      const myProfileService = new MyProfileService();

      yield apply(authService, authService.clear, []);
      yield apply(myProfileService, myProfileService.clear, []);

      window.location.replace('/login');
    };
  }
}
