import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { myIdSelector } from '@store/my-profile/selectors';
import { resetUnreadNotifications } from '@utils/set-favicon';
import { SagaIterator } from 'redux-saga';
import { select } from 'redux-saga/effects';
import { IFriendsState } from '../../friends-state';
import { IStatusChangedIntegrationEvent } from './status-changed-integration-event';
import { getUserDraftSelector } from '../../selectors';

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

  static get saga() {
    return function* changeUserOnlineStatus({
      payload,
    }: ReturnType<typeof UserStatusChangedEventHandler.action>): SagaIterator {
      const myId = yield select(myIdSelector);

      if (payload.userId === myId) {
        resetUnreadNotifications();
      }
    };
  }
}
