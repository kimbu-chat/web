import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { checkUserExist, findUserIndex } from '../../friends-utils';
import { IFriendsState } from '../../models';
import { IUserStatusChangedEventActionPayload } from './user-status-changed-event-action-payload';

export class UserStatusChangedEvent {
  static get action() {
    return createAction('USER_STATUS_CHANGED_EVENT')<IUserStatusChangedEventActionPayload>();
  }

  static get reducer() {
    return produce((draft: IFriendsState, { payload }: ReturnType<typeof UserStatusChangedEvent.action>) => {
      const { userId } = payload;
      const isUserExist = checkUserExist(userId, draft);

      if (!isUserExist) {
        return draft;
      }

      const userIndex = findUserIndex(userId, draft);

      draft.friends[userIndex].status = payload.status;
      draft.friends[userIndex].lastOnlineTime = new Date();

      return draft;
    });
  }
}
