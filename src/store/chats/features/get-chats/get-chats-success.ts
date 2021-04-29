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

      const newChats = Object.values(chats);

      draft.chats.chats = unionBy(draft.chats.chats, newChats, 'id');

      newChats.forEach(({ id: chatId }) => {
        if (!draft.messages[chatId]) {
          draft.messages[chatId] = {
            messages: [],
            messageIds: [],
            hasMore: true,
            loading: false,
          };
        }
      });

      if (searchString?.length) {
        draft.searchChats.hasMore = hasMore;
        draft.searchChats.loading = false;

        if (initializedByScroll) {
          draft.searchChats.chats = unionBy(draft.searchChats.chats, newChats, 'id');
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
