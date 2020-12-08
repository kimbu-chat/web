import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { MyProfileState } from '../../models';
import { UpdateMyNicknameSuccessActionPayload } from './update-my-nickname-success-action-payload';

export class UpdateMyNicknameSuccess {
  static get action() {
    return createAction('UPDATE_MY_NICKNAME_SUCCESS')<UpdateMyNicknameSuccessActionPayload>();
  }

  static get reducer() {
    return produce((draft: MyProfileState, { payload }: ReturnType<typeof UpdateMyNicknameSuccess.action>) => {
      draft.user!.nickname = payload.nickname;

      return draft;
    });
  }
}
