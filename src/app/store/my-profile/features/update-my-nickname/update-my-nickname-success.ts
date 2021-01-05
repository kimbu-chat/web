import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { IMyProfileState } from '../../models';
import { IUpdateMyNicknameSuccessActionPayload } from './action-payloads/update-my-nickname-success-action-payload';

export class UpdateMyNicknameSuccess {
  static get action() {
    return createAction('UPDATE_MY_NICKNAME_SUCCESS')<IUpdateMyNicknameSuccessActionPayload>();
  }

  static get reducer() {
    return produce((draft: IMyProfileState, { payload }: ReturnType<typeof UpdateMyNicknameSuccess.action>) => {
      draft.user!.nickname = payload.nickname;

      return draft;
    });
  }
}
