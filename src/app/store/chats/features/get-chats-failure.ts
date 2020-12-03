import { createEmptyAction } from 'app/store/common/actions';
import produce from 'immer';
import { ChatsState } from '../models';

export class GetChatsFailure {
  static get action() {
    return createEmptyAction('GET_CHATS_FAILURE');
  }

  static get reducer() {
    return produce((draft: ChatsState) => ({
      ...draft,
      loading: false,
    }));
  }
}
