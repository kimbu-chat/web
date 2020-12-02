import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { AuthState } from '../models';

export class SendSmsCodeSuccess {
  static get action() {
    return createAction('SEND_PHONE_CONFIRMATION_CODE_SUCCESS')<string>();
  }

  static get reducer() {
    return produce((draft: AuthState, { payload }: ReturnType<typeof SendSmsCodeSuccess.action>) => ({
      ...draft,
      loading: false,
      confirmationCode: payload,
    }));
  }
}
