import { IUser } from '@store/common/models';
import { createAction } from 'typesafe-actions';

export class BlockUserSuccess {
  static get action() {
    return createAction('BLOCK_USER_SUCCESS')<IUser>();
  }
}
