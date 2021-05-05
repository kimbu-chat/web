import { IMyProfileState } from '@store/my-profile/my-profile-state';
import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { IConfirmChangePhoneSuccessActionPayload } from './action-payloads/confirm-change-phone-success-action-payload';

export class ConfirmChangePhoneSuccess {
  static get action() {
    return createAction('CONFIRM_CHANGE_PHONE_SUCCESS')<IConfirmChangePhoneSuccessActionPayload>();
  }

  static get reducer() {
    return produce(
      (
        draft: IMyProfileState,
        { payload }: ReturnType<typeof ConfirmChangePhoneSuccess.action>,
      ) => {
        const { phoneNumber } = payload;

        if (draft.user) {
          draft.user.phoneNumber = phoneNumber;
        }

        return draft;
      },
    );
  }
}
