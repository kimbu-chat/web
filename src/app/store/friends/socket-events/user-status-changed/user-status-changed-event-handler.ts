import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { getUserDraftSelector } from 'store/friends/selectors';
import { IFriendsState } from '../../models';
import { IStatusChangedIntegrationEvent } from './status-changed-integration-event';

export class UserStatusChangedEventHandler {
  static get action() {
    return createAction('UserStatusChanged')<IStatusChangedIntegrationEvent>();
  }

  static get reducer() {
    return produce((draft: IFriendsState, { payload }: ReturnType<typeof UserStatusChangedEventHandler.action>) => {
      const { userId } = payload;
      const user = getUserDraftSelector(userId, draft);

      if (!user) {
        return draft;
      }

      user.status = payload.status;
      user.lastOnlineTime = new Date();

      return draft;
    });
  }
}
