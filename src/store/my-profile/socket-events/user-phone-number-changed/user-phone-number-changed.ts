import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { IMyProfileState } from '../../my-profile-state';
import { IUserPhoneNumberChangedActionPayload } from './action-payloads/user-phone-number-changed-action-payload';

export class UserPhoneNumberChangedEventHandler {
  static get action() {
    return createAction('UserPhoneNumberChanged')<IUserPhoneNumberChangedActionPayload>();
  }

  static get reducer() {
    return produce(
      (
        draft: IMyProfileState,
        { payload }: ReturnType<typeof UserPhoneNumberChangedEventHandler.action>,
      ) => {
        const { userId, phoneNumber } = payload;

        if (userId === draft.user?.id) {
          draft.user.phoneNumber = phoneNumber;
        }

        return draft;
      },
    );
  }
}
