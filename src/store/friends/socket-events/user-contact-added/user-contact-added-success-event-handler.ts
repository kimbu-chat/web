import produce from 'immer';
import { createAction } from 'typesafe-actions';

import { IFriendsState } from '../../friends-state';

import { IUserContactAddedIntegrationEvent } from './user-contact-added-integration-event';

export class UserContactAddedSuccessEventHandler {
  static get action() {
    return createAction('UserContactAddedSuccess')<IUserContactAddedIntegrationEvent>();
  }

  static get reducer() {
    return produce(
      (
        draft: IFriendsState,
        { payload }: ReturnType<typeof UserContactAddedSuccessEventHandler.action>,
      ) => {
        const { userId } = payload;
        const { friendIds } = draft.friends;
        if (!friendIds.some((id) => id === userId)) {
          friendIds.push(userId);
        }

        return draft;
      },
    );
  }
}
