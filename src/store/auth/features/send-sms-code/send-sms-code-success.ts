import produce from 'immer';

import { createEmptyAction } from '@store/common/actions';

import { IAuthState } from '../../auth-state';

export class SendSmsCodeSuccess {
  static get action() {
    return createEmptyAction('SEND_PHONE_CONFIRMATION_CODE_SUCCESS');
  }

  static get reducer() {
    return produce((draft: IAuthState) => {
      draft.loading = false;

      return draft;
    });
  }
}
