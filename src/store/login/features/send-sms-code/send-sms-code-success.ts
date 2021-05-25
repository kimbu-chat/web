import produce from 'immer';

import { createEmptyAction } from '@store/common/actions';

import { ILoginState } from '../../login-state';

export class SendSmsCodeSuccess {
  static get action() {
    return createEmptyAction('SEND_PHONE_CONFIRMATION_CODE_SUCCESS');
  }

  static get reducer() {
    return produce((draft: ILoginState) => {
      draft.loading = false;

      return draft;
    });
  }
}
