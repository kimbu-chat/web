import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { IAuthState } from '../../models';
import { IConfirmPhoneRegistrationAllowedActionPayload } from './action-payloads/confirm-phone-registration-allowed-action-payload';

export class ConfirmPhoneRegistrationAllowed {
  static get action() {
    return createAction('CONFIRM_PHONE_REGISTRATION_ALLOWED')<IConfirmPhoneRegistrationAllowedActionPayload>();
  }

  static get reducer() {
    return produce((draft: IAuthState, { payload }: ReturnType<typeof ConfirmPhoneRegistrationAllowed.action>) => ({
      ...draft,
      loading: false,
      registrationAllowed: true,
      confirmationCode: payload.confirmationCode,
    }));
  }
}
