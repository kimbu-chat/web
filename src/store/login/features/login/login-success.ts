import { createEmptyAction } from '@store/common/actions';

export class LoginSuccess {
  static get action() {
    return createEmptyAction('LOGIN_SUCCESS');
  }
}
