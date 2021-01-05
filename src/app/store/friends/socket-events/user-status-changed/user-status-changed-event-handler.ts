import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { getUserIndexDraftSelector } from 'store/friends/selectors';
import { IFriendsState } from '../../models';
import { IStatusChangedIntegrationEvent } from './status-changed-integration-event';

export class UserStatusChangedEventHandler {
  static get action() {
    return createAction('UserStatusChanged')<IStatusChangedIntegrationEvent>();
  }

  static get reducer() {
    return produce((draft: IFriendsState, { payload }: ReturnType<typeof UserStatusChangedEventHandler.action>) => {
      const { userId } = payload;
      const userIndex = getUserIndexDraftSelector(userId, draft);

      if (userIndex === -1) {
        return draft;
      }

      draft.friends[userIndex].status = payload.status;
      draft.friends[userIndex].lastOnlineTime = new Date();

      return draft;
    });
  }
}
