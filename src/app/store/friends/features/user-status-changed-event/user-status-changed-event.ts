import { StatusChangedIntegrationEvent } from 'app/store/middlewares/websockets/integration-events/status-changed-integration-event';
import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { checkUserExist, findUserIndex } from '../../friends-utils';
import { FriendsState } from '../../models';

export class UserStatusChangedEvent {
  static get action() {
    return createAction('USER_STATUS_CHANGED_EVENT')<StatusChangedIntegrationEvent>();
  }

  static get reducer() {
    return produce((draft: FriendsState, { payload }: ReturnType<typeof UserStatusChangedEvent.action>) => {
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
