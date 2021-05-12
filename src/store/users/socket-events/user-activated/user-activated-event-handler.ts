import { IUsersState } from '@store/users/users-state';
import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { IUserActivatedActionPayload } from './action-payloads/user-activated-action-payload';

export class UserActivatedEventHandler {
  static get action() {
    return createAction('UserActivated')<IUserActivatedActionPayload>();
  }

  static get reducer() {
    return produce(
      (draft: IUsersState, { payload }: ReturnType<typeof UserActivatedEventHandler.action>) => {
        const { userId } = payload;
        const user = draft.users[userId];

        if (user) {
          user.deactivated = false;
        }

        return draft;
      },
    );
  }
}
