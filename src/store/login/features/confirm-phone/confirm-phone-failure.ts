import { createAction } from '@reduxjs/toolkit';

import { ILoginState } from '../../login-state';

export class ConfirmPhoneFailure {
  static get action() {
    return createAction('CONFIRM_PHONE_FAILURE');
  }

  static get reducer() {
    return (draft: ILoginState) => {
      draft.loading = false;
      draft.isConfirmationCodeWrong = true;
      return draft;
    };
  }
}
