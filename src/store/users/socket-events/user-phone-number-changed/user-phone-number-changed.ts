import { createAction } from '@reduxjs/toolkit';

import { IUsersState } from '@store/users/users-state';

import { IUserPhoneNumberChangedActionPayload } from './action-payloads/user-phone-number-changed-action-payload';

export class UserPhoneNumberChangedEventHandler {
  static get action() {
    return createAction<IUserPhoneNumberChangedActionPayload>('UserPhoneNumberChanged');
  }

  static get reducer() {
    return (
        draft: IUsersState,
        { payload }: ReturnType<typeof UserPhoneNumberChangedEventHandler.action>,
      ) => {
        const { userId, phoneNumber } = payload;
        const user = draft.users[userId];

        if (user) {
          user.phoneNumber = phoneNumber;
        }

        return draft;
      }
  }
}
