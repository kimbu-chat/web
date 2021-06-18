import produce from 'immer';

import { createEmptyAction } from '@store/common/actions';
import { ILoginState } from '@store/login/login-state';

export class LoginSuccess {
  static get action() {
    return createEmptyAction('LOGIN_SUCCESS');
  }

  static get reducer() {
    return produce((draft: ILoginState) => ({
      ...draft,
      isAuthenticated: true,
    }));
  }
}
