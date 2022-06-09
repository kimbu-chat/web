import { createAction } from '@reduxjs/toolkit';
import merge from 'lodash/merge';

import { INormalizedChat } from '@store/chats/models';

import { IChatsState } from '../../chats-state';

export interface IGetChatsSuccessActionPayload {
  initializedByScroll: boolean;
  chats: Record<number, INormalizedChat>;
  chatIds: number[];
  hasMore: boolean;
  searchString?: string;
}

export class GetChatsSuccess {
  static get action() {
    return createAction<IGetChatsSuccessActionPayload>('GET_CHATS_SUCCESS');
  }

  static get reducer() {
    return (draft: IChatsState, { payload }: ReturnType<typeof GetChatsSuccess.action>) => {
      const { chats, hasMore, initializedByScroll, searchString, chatIds } = payload;

      draft.chats = merge(draft.chats, chats);

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
    };
  }
}
