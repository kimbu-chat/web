import produce from 'immer';

import { createEmptyAction } from '@store/common/actions';

import { ILoginState } from '../../login-state';

export class ConfirmPhoneFailure {
  static get action() {
    return createEmptyAction('CONFIRM_PHONE_FAILURE');
  }

  static get reducer() {
    return produce((draft: ILoginState) => {
      draft.loading = false;
      draft.isConfirmationCodeWrong = true;
      return draft;
    });
  }
}
