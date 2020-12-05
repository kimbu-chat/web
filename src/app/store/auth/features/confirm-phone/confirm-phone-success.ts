import produce from 'immer';
import { createEmptyAction } from '../../../common/actions';
import { AuthState } from '../../models';

export class ConfirmPhoneSuccess {
  static get action() {
    return createEmptyAction('CONFIRM_PHONE_SUCCESS');
  }

  static get reducer() {
    return produce((draft: AuthState) => {
      draft.loading = false;

      return draft;
    });
  }
}
