import produce from 'immer';
import { createEmptyAction } from '../../../common/actions';
import { AuthState } from '../../models';

export class ConfirmPhoneFailure {
  static get action() {
    return createEmptyAction('CONFIRM_PHONE_FAILURE');
  }

  static get reducer() {
    return produce((draft: AuthState) => {
      draft.loading = false;
      draft.isConfirmationCodeWrong = true;
      return draft;
    });
  }
}
