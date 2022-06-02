import { createAction } from '@reduxjs/toolkit';

import { IUsersState } from '@store/users/users-state';

import { IUserEditedIntegrationEvent } from './action-payloads/user-edited-integration-event';

export class UserEditedEventHandler {
  static get action() {
    return createAction<IUserEditedIntegrationEvent>('UserEdited');
  }

  static get reducer() {
    return (draft: IUsersState, { payload }: ReturnType<typeof UserEditedEventHandler.action>) => {
        const {
          userId,
          firstName,
          lastName,
          nickname,
          avatarId,
          avatarUrl,
          avatarPreviewUrl,
        } = payload;

        const user = draft.users[userId];

        if (!user) {
          return draft;
        }

        user.firstName = firstName;
        user.lastName = lastName;
        user.nickname = nickname;

        user.avatar = {
          id: avatarId,
          url: avatarUrl,
          previewUrl: avatarPreviewUrl,
        };

        return draft;
      }
  }
}
