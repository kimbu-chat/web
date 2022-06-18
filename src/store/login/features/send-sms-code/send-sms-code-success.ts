import { createAction } from '@reduxjs/toolkit';

import { ILoginState } from '../../login-state';

export class SendSmsCodeSuccess {
  static get action() {
    return createAction('SEND_PHONE_CONFIRMATION_CODE_SUCCESS');
  }

  static get reducer() {
    return (draft: ILoginState) => {
      draft.loading = false;
      return draft;
    };
  }
}
