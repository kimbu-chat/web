import produce from 'immer';
import { createEmptyAction } from '@store/common/actions';
import { IChatsState } from '../../chats-state';

export class GetChatsFailure {
  static get action() {
    return createEmptyAction('GET_CHATS_FAILURE');
  }

  static get reducer() {
    return produce((draft: IChatsState) => {
      draft.loading = false;

      return draft;
    });
  }
}
