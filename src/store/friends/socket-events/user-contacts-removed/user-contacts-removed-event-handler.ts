import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { IFriendsState } from '../../friends-state';
import { IUserContactsRemovedIntegrationEvent } from './user-contacts-removed-integration-event';

export class UserContactsRemovedEventHandler {
  static get action() {
    return createAction('UserContactsRemoved')<IUserContactsRemovedIntegrationEvent>();
  }

  static get reducer() {
    return produce(
      (
        draft: IFriendsState,
        { payload }: ReturnType<typeof UserContactsRemovedEventHandler.action>,
      ) => {
        const { removedUserIds } = payload;

        draft.friends.friends = draft.friends.friends.filter(
          ({ id }) => !removedUserIds.includes(id),
        );
        draft.searchFriends.friends = draft.searchFriends.friends?.filter(
          ({ id }) => !removedUserIds.includes(id),
        );

        return draft;
      },
    );
  }
}
