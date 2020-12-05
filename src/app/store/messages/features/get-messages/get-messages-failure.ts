import { createEmptyAction } from 'app/store/common/actions';
import produce from 'immer';
import { MessagesState } from '../../models';

export class GetMessagesFailure {
  static get action() {
    return createEmptyAction('GET_MESSAGES_FAILURE');
  }

  static get reducer() {
    return produce((draft: MessagesState) => {
      draft.loading = false;
      return draft;
    });
  }
}
