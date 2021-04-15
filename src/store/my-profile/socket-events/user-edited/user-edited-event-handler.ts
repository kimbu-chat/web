import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { IMyProfileState } from '../../my-profile-state';
import { IUserEditedIntegrationEvent } from './action-payloads/user-edited-integration-event';

export class UserEditedEventHandler {
  static get action() {
    return createAction('UserEdited')<IUserEditedIntegrationEvent>();
  }

  static get reducer() {
    return produce(
      (draft: IMyProfileState, { payload }: ReturnType<typeof UserEditedEventHandler.action>) => {
        const {
          userId,
          firstName,
          lastName,
          nickname,
          avatarId,
          avatarUrl,
          avatarPreviewUrl,
        } = payload;

        if (userId === draft.user?.id) {
          draft.user.firstName = firstName;
          draft.user.lastName = lastName;
          draft.user.nickname = nickname;

          draft.user.avatar = {
            id: avatarId,
            url: avatarUrl,
            previewUrl: avatarPreviewUrl,
          };
        }

        return draft;
      },
    );
  }
}
