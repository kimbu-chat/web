import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { IFriendsState } from '../../friends-state';
import { getUserDraftSelector } from '../../selectors';
import { IUserEditedIntegrationEvent } from './action-payloads/user-edited-integration-event';

export class UserEditedEventHandler {
  static get action() {
    return createAction('UserEdited')<IUserEditedIntegrationEvent>();
  }

  static get reducer() {
    return produce((draft: IFriendsState, { payload }: ReturnType<typeof UserEditedEventHandler.action>) => {
      const { userId, firstName, lastName, nickname, avatarId, avatarUrl, avatarPreviewUrl } = payload;
      const user = getUserDraftSelector(userId, draft);

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
    });
  }
}
