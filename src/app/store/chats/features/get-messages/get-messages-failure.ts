import { IChatsState } from 'store/chats/models';
import { createEmptyAction } from 'app/store/common/actions';
import produce from 'immer';

export class GetMessagesFailure {
  static get action() {
    return createEmptyAction('GET_MESSAGES_FAILURE');
  }

  static get reducer() {
    return produce((draft: IChatsState) => {
      draft.loading = false;
      return draft;
    });
  }
}
