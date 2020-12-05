import { createAction } from 'typesafe-actions';
import { LoginResponse } from '../../models';

export class RefreshTokenSuccess {
  static get action() {
    return createAction('REFRESH_TOKEN_SUCCESS')<LoginResponse>();
  }
}
