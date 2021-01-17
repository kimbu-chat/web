import produce from 'immer';
import { unionBy } from 'lodash';
import { createAction } from 'typesafe-actions';
import { IChatsState } from '../../models';
import { IGetChatsSuccessActionPayload } from './action-payloads/get-chats-success-action-payload';

export class GetChatsSuccess {
  static get action() {
    return createAction('GET_CHATS_SUCCESS')<IGetChatsSuccessActionPayload>();
  }

  static get reducer() {
    return produce((draft: IChatsState, { payload }: ReturnType<typeof GetChatsSuccess.action>) => {
      const { chats, hasMore, initializedByScroll } = payload;

      draft.loading = false;
      draft.hasMore = hasMore;
      draft.chats = unionBy(draft.chats, chats, 'id');

      chats.forEach(({ id: chatId }) => {
        if (!draft.messages[chatId]) {
          draft.messages[chatId] = {
            messages: [],
            hasMore: true,
            loading: false,
          };
        }
      });

      if (draft.searchString.length > 0) {
        if (initializedByScroll) {
          draft.searchChats = unionBy(draft.searchChats, chats, 'id');
        } else {
          draft.searchChats = chats;
        }
      }

      return draft;
    });
  }
}
