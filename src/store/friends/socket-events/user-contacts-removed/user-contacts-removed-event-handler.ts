import { createAction } from '@reduxjs/toolkit';

import { IFriendsState } from '../../friends-state';

import { IUserContactsRemovedIntegrationEvent } from './user-contacts-removed-integration-event';

export class UserContactsRemovedEventHandler {
  static get action() {
    return createAction<IUserContactsRemovedIntegrationEvent>('UserContactsRemoved');
  }

  static get reducer() {
    return (
        draft: IFriendsState,
        { payload }: ReturnType<typeof UserContactsRemovedEventHandler.action>,
      ) => {
        const { userIds } = payload;

        draft.friends.friendIds = draft.friends.friendIds.filter((id) => !userIds.includes(id));
        draft.searchFriends.friendIds = draft.searchFriends.friendIds?.filter(
          (id) => !userIds.includes(id),
        );

        return draft;
      };
  }
}
