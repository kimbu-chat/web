import produce from 'immer';
import { SagaIterator } from 'redux-saga';
import { createEmptyAction } from '@store/common/actions';
import { apply, call } from 'redux-saga/effects';
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
    return function* refreshTokenFailure(): SagaIterator {
      yield call({ context: localStorage, fn: localStorage.clear });
      yield apply(window.location, window.location.reload, [true]);
    };
  }
}
