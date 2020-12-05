import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { MyProfileState, UserPreview } from '../../models';

export class GetMyProfileSuccess {
  static get action() {
    return createAction('GET_MY_PROFILE_SUCCESS')<UserPreview>();
  }

  static get reducer() {
    return produce((draft: MyProfileState, { payload }: ReturnType<typeof GetMyProfileSuccess.action>) => ({
      ...draft,
      user: payload,
    }));
  }
}
