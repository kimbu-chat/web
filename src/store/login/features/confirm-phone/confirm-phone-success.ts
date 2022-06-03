import { createAction } from '@reduxjs/toolkit';

import { ILoginState } from '@store/login/login-state';

import { IConfirmPhoneSuccessActionPayload } from './action-payloads/confirm-phone-success-action-payload';

export class ConfirmPhoneSuccess {
  static get action() {
    return createAction<IConfirmPhoneSuccessActionPayload>('CONFIRM_PHONE_SUCCESS');
  }

  static get reducer() {
    return (draft: ILoginState, { payload }: ReturnType<typeof ConfirmPhoneSuccess.action>) => {
        draft.loading = false;
        draft.confirmationCode = payload.confirmationCode;
        return draft;
      };
  }
}
