import produce from 'immer';
import { createAction } from 'typesafe-actions';

import { IFriendsState } from '../../friends-state';

import { IUserContactAddedIntegrationEvent } from './user-contact-added-integration-event';

export class UserContactAddedSuccessEventHandler {
  static get action() {
    return createAction('UserContactsRemoved')<IUserContactAddedIntegrationEvent>();
  }

  static get reducer() {
    return produce(
      (
        draft: IFriendsState,
        { payload }: ReturnType<typeof UserContactAddedSuccessEventHandler.action>,
      ) => {
        const { userId } = payload;

        draft.friends.friendIds.unshift(userId);

        return draft;
      },
    );
  }
}
