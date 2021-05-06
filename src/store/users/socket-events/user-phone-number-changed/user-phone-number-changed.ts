import { IUsersState } from '@store/users/users-state';
import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { IUserPhoneNumberChangedActionPayload } from './action-payloads/user-phone-number-changed-action-payload';

export class UserPhoneNumberChangedEventHandler {
  static get action() {
    return createAction('UserPhoneNumberChanged')<IUserPhoneNumberChangedActionPayload>();
  }

  static get reducer() {
    return produce(
      (
        draft: IUsersState,
        { payload }: ReturnType<typeof UserPhoneNumberChangedEventHandler.action>,
      ) => {
        const { userId, phoneNumber } = payload;
        const user = draft.users[userId];

        if (user) {
          user.phoneNumber = phoneNumber;
        }

        return draft;
      },
    );
  }
}
