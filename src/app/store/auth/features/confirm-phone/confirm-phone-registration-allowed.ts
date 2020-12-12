import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { AuthState } from '../../models';
import { ConfirmPhoneRegistrationAllowedActionPayload } from './confirm-phone-registration-allowed-action-payload';

export class ConfirmPhoneRegistrationAllowed {
  static get action() {
    return createAction('CONFIRM_PHONE_REGISTRATION_ALLOWED')<ConfirmPhoneRegistrationAllowedActionPayload>();
  }

  static get reducer() {
    return produce((draft: AuthState, { payload }: ReturnType<typeof ConfirmPhoneRegistrationAllowed.action>) => ({
      ...draft,
      loading: false,
      registrationAllowed: true,
      confirmationCode: payload.confirmationCode,
    }));
  }
}
