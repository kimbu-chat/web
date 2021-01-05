import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { IMyProfileState } from '../../models';
import { IGetMyProfileSuccessActionPayload } from './action-payloads/get-my-profile-success-action-payload';

export class GetMyProfileSuccess {
  static get action() {
    return createAction('GET_MY_PROFILE_SUCCESS')<IGetMyProfileSuccessActionPayload>();
  }

  static get reducer() {
    return produce((draft: IMyProfileState, { payload }: ReturnType<typeof GetMyProfileSuccess.action>) => ({
      ...draft,
      user: payload,
    }));
  }
}
