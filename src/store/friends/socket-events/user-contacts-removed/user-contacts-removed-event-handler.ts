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

        draft.friends = draft.friends.filter(({ id }) => !removedUserIds.includes(id));

        return draft;
      },
    );
  }
}
