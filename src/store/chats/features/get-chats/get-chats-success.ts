import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { IChatsState } from '../../chats-state';
import { IGetChatsSuccessActionPayload } from './action-payloads/get-chats-success-action-payload';

export class GetChatsSuccess {
  static get action() {
    return createAction('GET_CHATS_SUCCESS')<IGetChatsSuccessActionPayload>();
  }

  static get reducer() {
    return produce((draft: IChatsState, { payload }: ReturnType<typeof GetChatsSuccess.action>) => {
      const { chats, hasMore, initializedByScroll, searchString, chatIds } = payload;

      draft.chats = { ...draft.chats, ...chats };

      chatIds.forEach((chatId) => {
        if (!draft.messages[chatId]) {
          draft.messages[chatId] = {
            messages: {},
            messageIds: [],
            hasMore: true,
            loading: false,
          };
        }
      });

      if (searchString?.length) {
        draft.searchChatList.hasMore = hasMore;
        draft.searchChatList.loading = false;

        if (initializedByScroll) {
          draft.searchChatList.chatIds = [
            ...new Set([...draft.searchChatList.chatIds, ...chatIds]),
          ];
        } else {
          draft.searchChatList.chatIds = chatIds;
        }
      } else if (payload.initializedByScroll) {
        draft.chatList.hasMore = hasMore;
        draft.chatList.loading = false;
        draft.chatList.chatIds = [...new Set([...draft.chatList.chatIds, ...chatIds])];
      }

      return draft;
    });
  }
}
