import produce from 'immer';
import { createAction } from 'typesafe-actions';

import { IChatsState } from '@store/chats/chats-state';

export class ResetSearchPossibleMembers {
  static get action() {
    return createAction('RESET_SEARCH_POSSIBLE_MEMBERS')<{ chatId: number }>();
  }

  static get reducer() {
    return produce(
      (
        draft: IChatsState,
        { payload: { chatId } }: ReturnType<typeof ResetSearchPossibleMembers.action>,
      ) => {
        draft.chats[chatId].possibleMembers.data = [];
        draft.chats[chatId].possibleMembers.hasMore = true;
        draft.chats[chatId].possibleMembers.loading = false;

        return draft;
      },
    );
  }
}
