import { CloseWebsocketConnection } from 'app/store/web-sockets/features/close-web-socket-connection/close-web-socket-connection';
import produce from 'immer';
import { SagaIterator } from 'redux-saga';
import { put } from 'redux-saga/effects';
import { createEmptyAction } from 'store/common/actions';
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
    return function* (): SagaIterator {
      localStorage.clear();
      yield put(CloseWebsocketConnection.action());
    };
  }
}
