import produce from 'immer';
import { createAction } from 'typesafe-actions';

import { IUser } from '@store/common/models';

import { IUserSettings } from '../../user-settings-state';

export class GetBlackListSuccess {
  static get action() {
    return createAction('GET_BLACK_LIST_SUCCESS')<IUser[]>();
  }

  static get reducer() {
    return produce(
      (draft: IUserSettings, { payload }: ReturnType<typeof GetBlackListSuccess.action>) => {
        draft.blackList.users = payload;
        draft.blackList.isLoading = false;
        return draft;
      },
    );
  }
}
