import { createEmptyAction } from 'store/common/actions';

export class LogoutSuccess {
  static get action() {
    return createEmptyAction('LOGOUT_SUCCESS');
  }
}
