import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { IAuthState } from '../../auth-state';
import { IConfirmPhoneSuccessActionPayload } from './action-payloads/confirm-phone-success-action-payload';

export class ConfirmPhoneSuccess {
  static get action() {
    return createAction('CONFIRM_PHONE_SUCCESS')<IConfirmPhoneSuccessActionPayload>();
  }

  static get reducer() {
    return produce((draft: IAuthState, { payload }: ReturnType<typeof ConfirmPhoneSuccess.action>) => {
      draft.loading = false;
      draft.confirmationCode = payload.confirmationCode;
      return draft;
    });
  }
}
