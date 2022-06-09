import { createAction } from '@reduxjs/toolkit';

import { IFriendsState } from '../../friends-state';

import { IUserContactAddedIntegrationEvent } from './user-contact-added-integration-event';

export class UserContactAddedSuccessEventHandler {
  static get action() {
    return createAction<IUserContactAddedIntegrationEvent>('UserContactAddedSuccess');
  }

  static get reducer() {
    return (
      draft: IFriendsState,
      { payload }: ReturnType<typeof UserContactAddedSuccessEventHandler.action>,
    ) => {
      const { userId } = payload;
      const { friendIds } = draft.friends;
      if (!friendIds.some((id) => id === userId)) {
        friendIds.push(userId);
      }

      return draft;
    };
  }
}
