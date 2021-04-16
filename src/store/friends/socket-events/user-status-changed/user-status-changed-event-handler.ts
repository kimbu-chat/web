import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { getUserDraftSelector } from '../../selectors';
import { IStatusChangedIntegrationEvent } from './status-changed-integration-event';
import { IFriendsState } from '../../friends-state';

export class UserStatusChangedEventHandler {
  static get action() {
    return createAction('UserStatusChanged')<IStatusChangedIntegrationEvent>();
  }

  static get reducer() {
    return produce(
      (
        draft: IFriendsState,
        { payload }: ReturnType<typeof UserStatusChangedEventHandler.action>,
      ) => {
        const { userId } = payload;
        const user = getUserDraftSelector(userId, draft);

        if (!user) {
          return draft;
        }

        user.online = payload.online;
        user.lastOnlineTime = new Date();

        return draft;
      },
    );
  }
}
