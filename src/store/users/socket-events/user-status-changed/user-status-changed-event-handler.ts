import { createAction } from '@reduxjs/toolkit';
import { SagaIterator } from 'redux-saga';
import { select } from 'redux-saga/effects';

import { myIdSelector } from '@store/my-profile/selectors';
import { resetUnreadNotifications } from '@utils/set-favicon';

import { IUsersState } from '../../users-state';

import { IStatusChangedIntegrationEvent } from './status-changed-integration-event';

export class UserStatusChangedEventHandler {
  static get action() {
    return createAction<IStatusChangedIntegrationEvent>('UserStatusChanged');
  }

  static get reducer() {
    return (
      draft: IUsersState,
      { payload }: ReturnType<typeof UserStatusChangedEventHandler.action>,
    ) => {
      const { userId } = payload;
      const user = draft.users[userId];

      if (!user) {
        return draft;
      }

      user.online = payload.online;
      user.lastOnlineTime = payload.lastOnlineTime;

      return draft;
    };
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
