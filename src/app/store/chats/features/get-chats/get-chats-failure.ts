import { createEmptyAction } from 'app/store/common/actions';
import produce from 'immer';
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
