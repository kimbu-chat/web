import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { MyProfileState } from '../../models';
import { GetMyProfileSuccessActionPayload } from './get-my-profile-success-action-payload';

export class GetMyProfileSuccess {
  static get action() {
    return createAction('GET_MY_PROFILE_SUCCESS')<GetMyProfileSuccessActionPayload>();
  }

  static get reducer() {
    return produce((draft: MyProfileState, { payload }: ReturnType<typeof GetMyProfileSuccess.action>) => ({
      ...draft,
      user: payload,
    }));
  }
}
