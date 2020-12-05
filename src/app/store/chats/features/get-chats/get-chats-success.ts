import produce from 'immer';
import { unionBy } from 'lodash';
import { createAction } from 'typesafe-actions';
import { GetChatsResponse, ChatsState } from '../../models';

export class GetChatsSuccess {
  static get action() {
    return createAction('GET_CHATS_SUCCESS')<GetChatsResponse>();
  }

  static get reducer() {
    return produce((draft: ChatsState, { payload }: ReturnType<typeof GetChatsSuccess.action>) => {
      const { chats, hasMore, initializedBySearch } = payload;

      draft.loading = false;
      draft.hasMore = hasMore;

      if (initializedBySearch) {
        draft.chats = chats;
      } else {
        draft.chats = unionBy(draft.chats, chats, 'id');
      }

      return draft;
    });
  }
}
