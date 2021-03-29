import { IUser } from '@app/store/common/models';
import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { IUserSettings } from '../../user-settings-state';

export class BlockUserSuccess {
  static get action() {
    return createAction('BLOCK_USER_SUCCESS')<IUser>();
  }

  static get reducer() {
    return produce((draft: IUserSettings, { payload }: ReturnType<typeof BlockUserSuccess.action>) => {
      draft.blackList.users.push(payload);
      return draft;
    });
  }
}
