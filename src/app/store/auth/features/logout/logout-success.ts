import { createEmptyAction } from '../../../common/actions';

export class LogoutSuccess {
  static get action() {
    return createEmptyAction('LOGOUT_SUCCESS');
  }
}
