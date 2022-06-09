import { createAction } from '@reduxjs/toolkit';

import { IUsersState } from '@store/users/users-state';

import { IUserActivatedActionPayload } from './action-payloads/user-activated-action-payload';

export class UserActivatedEventHandler {
  static get action() {
    return createAction<IUserActivatedActionPayload>('UserActivated');
  }

  static get reducer() {
    return (
      draft: IUsersState,
      { payload }: ReturnType<typeof UserActivatedEventHandler.action>,
    ) => {
      const { userId } = payload;
      const user = draft.users[userId];

      if (user) {
        user.deactivated = false;
      }

      return draft;
    };
  }
}
