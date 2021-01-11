import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { ICallsState } from '../../models';
import { IUserEditedIntegrationEvent } from './action-payloads/user-edited-integration-event';

export class UserEditedEventHandler {
  static get action() {
    return createAction('UserEdited')<IUserEditedIntegrationEvent>();
  }

  static get reducer() {
    return produce((draft: ICallsState, { payload }: ReturnType<typeof UserEditedEventHandler.action>) => {
      const { userId, firstName, lastName, nickname, avatarId, avatarUrl, avatarPreviewUrl } = payload;

      draft.calls.calls.forEach((call) => {
        if (call.userInterlocutor.id === userId) {
          call.userInterlocutor.firstName = firstName;
          call.userInterlocutor.lastName = lastName;
          call.userInterlocutor.nickname = nickname;

          call.userInterlocutor.avatar = {
            id: avatarId,
            url: avatarUrl,
            previewUrl: avatarPreviewUrl,
          };
        }
      });

      return draft;
    });
  }
}
