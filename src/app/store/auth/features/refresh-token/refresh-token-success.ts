import { createAction } from 'typesafe-actions';
import { RefreshTokenSuccessActionPayload } from './refresh-token-success-action-payload';

export class RefreshTokenSuccess {
  static get action() {
    return createAction('REFRESH_TOKEN_SUCCESS')<RefreshTokenSuccessActionPayload>();
  }
}
