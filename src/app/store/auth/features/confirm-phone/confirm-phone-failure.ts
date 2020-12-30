import produce from 'immer';
import { createEmptyAction } from 'store/common/actions';
import { IAuthState } from '../../models';

export class ConfirmPhoneFailure {
  static get action() {
    return createEmptyAction('CONFIRM_PHONE_FAILURE');
  }

  static get reducer() {
    return produce((draft: IAuthState) => {
      draft.loading = false;
      draft.isConfirmationCodeWrong = true;
      return draft;
    });
  }
}
