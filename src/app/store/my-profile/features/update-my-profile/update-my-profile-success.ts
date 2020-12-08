import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { MyProfileState } from '../../models';
import { UpdateMyProfileSuccessActionPayload } from './update-my-profile-success-action-payload';

export class UpdateMyProfileSuccess {
  static get action() {
    return createAction('UPDATE_MY_PROFILE_INFO_SUCCESS')<UpdateMyProfileSuccessActionPayload>();
  }

  static get reducer() {
    return produce((draft: MyProfileState, { payload }: ReturnType<typeof UpdateMyProfileSuccess.action>) => {
      draft.user!.firstName = payload.firstName;
      draft.user!.lastName = payload.lastName;
      draft.user!.avatar = payload.avatar;

      return draft;
    });
  }
}
