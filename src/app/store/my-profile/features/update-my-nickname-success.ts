import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { MyProfileState, UpdateNicknameActionData } from '../models';

export class UpdateMyNicknameSuccess {
  static get action() {
    return createAction('UPDATE_MY_NICKNAME_SUCCESS')<UpdateNicknameActionData>();
  }

  static get reducer() {
    return produce((draft: MyProfileState, { payload }: ReturnType<typeof UpdateMyNicknameSuccess.action>) => {
      draft.user!.nickname = payload.nickname;

      return draft;
    });
  }
}
