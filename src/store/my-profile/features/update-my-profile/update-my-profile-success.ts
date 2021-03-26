import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { IMyProfileState } from '../../my-profile-state';
import { IUpdateMyProfileSuccessActionPayload } from './action-payloads/update-my-profile-success-action-payload';

export class UpdateMyProfileSuccess {
  static get action() {
    return createAction('UPDATE_MY_PROFILE_INFO_SUCCESS')<IUpdateMyProfileSuccessActionPayload>();
  }

  static get reducer() {
    return produce(
      (draft: IMyProfileState, { payload }: ReturnType<typeof UpdateMyProfileSuccess.action>) => {
        if (draft.user) {
          draft.user.firstName = payload.firstName;
          draft.user.lastName = payload.lastName;
          draft.user.avatar = payload.avatar;
          draft.user.nickname = payload.nickname;
        }

        return draft;
      },
    );
  }
}
