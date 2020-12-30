import produce from 'immer';
import { createEmptyAction } from 'store/common/actions';
import { IAuthState } from '../../models';

export class ConfirmPhoneSuccess {
  static get action() {
    return createEmptyAction('CONFIRM_PHONE_SUCCESS');
  }

  static get reducer() {
    return produce((draft: IAuthState) => {
      draft.loading = false;

      return draft;
    });
  }
}
