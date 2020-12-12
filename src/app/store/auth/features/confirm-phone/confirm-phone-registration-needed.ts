import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { AuthState } from '../../models';
import { ConfirmPhoneRegistrationNeededActionPayload } from './confirm-phone-registration-needed-action-payload';

export class ConfirmPhoneRegistrationNeeded {
  static get action() {
    return createAction('CONFIRM_PHONE_REGISTRATION_NEEDED')<ConfirmPhoneRegistrationNeededActionPayload>();
  }

  static get reducer() {
    return produce((draft: AuthState, { payload }: ReturnType<typeof ConfirmPhoneRegistrationNeeded.action>) => ({
      ...draft,
      loading: false,
      registrationNeeded: true,
      confirmationCode: payload.confirmationCode,
    }));
  }
}
