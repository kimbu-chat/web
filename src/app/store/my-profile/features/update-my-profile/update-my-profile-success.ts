import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { MyProfileState, UpdateMyProfileActionData } from '../../models';

export class UpdateMyProfileSuccess {
  static get action() {
    return createAction('UPDATE_MY_PROFILE_INFO_SUCCESS')<UpdateMyProfileActionData>();
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
