import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { ICallsState } from '../../calls-state';
import { IUserEditedIntegrationEvent } from './action-payloads/user-edited-integration-event';

export class UserEditedEventHandler {
  static get action() {
    return createAction('UserEdited')<IUserEditedIntegrationEvent>();
  }

  static get reducer() {
    return produce(
      (draft: ICallsState, { payload }: ReturnType<typeof UserEditedEventHandler.action>) => {
        const {
          userId,
          firstName,
          lastName,
          nickname,
          avatarId,
          avatarUrl,
          avatarPreviewUrl,
        } = payload;

        draft.calls.calls = draft.calls.calls.map((call) => {
          if (call.userInterlocutor.id === userId) {
            return {
              ...call,
              userInterlocutor: {
                ...call.userInterlocutor,
                firstName,
                lastName,
                nickname,
                avatar: {
                  id: avatarId,
                  url: avatarUrl,
                  previewUrl: avatarPreviewUrl,
                },
              },
            };
          }

          return call;
        });

        return draft;
      },
    );
  }
}
