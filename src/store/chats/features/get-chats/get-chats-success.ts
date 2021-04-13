import produce from 'immer';
import { unionBy } from 'lodash';
import { createAction } from 'typesafe-actions';
import { IChatsState } from '../../chats-state';
import { IGetChatsSuccessActionPayload } from './action-payloads/get-chats-success-action-payload';

export class GetChatsSuccess {
  static get action() {
    return createAction('GET_CHATS_SUCCESS')<IGetChatsSuccessActionPayload>();
  }

  static get reducer() {
    return produce((draft: IChatsState, { payload }: ReturnType<typeof GetChatsSuccess.action>) => {
      const { chats, hasMore, initializedByScroll, searchString } = payload;

      draft.chats.chats = unionBy(draft.chats.chats, chats, 'id');

      chats.forEach(({ id: chatId }) => {
        if (!draft.messages[chatId]) {
          draft.messages[chatId] = {
            messages: [],
            hasMore: true,
            loading: false,
          };
        }
      });

      if (searchString?.length) {
        draft.searchChats.hasMore = hasMore;
        draft.searchChats.loading = false;

        if (initializedByScroll) {
          draft.searchChats.chats = unionBy(draft.searchChats.chats, chats, 'id');
        } else {
          draft.searchChats.chats = chats;
        }
      } else if (payload.initializedByScroll) {
        draft.chats.hasMore = hasMore;
        draft.chats.loading = false;
      }

      return draft;
    });
  }
}
