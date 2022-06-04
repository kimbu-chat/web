import { createAction } from '@reduxjs/toolkit';
import merge from 'lodash/merge';

import { INormalizedChat } from '@store/chats/models';

import { IChatsState } from '../../chats-state';


export type IUnshiftChatActionPayload = { chat: INormalizedChat; addToList: boolean };

export class UnshiftChat {
  static get action() {
    return createAction<IUnshiftChatActionPayload>('UNSHIFT_CHAT');
  }

  static get reducer() {
    return (draft: IChatsState, { payload }: ReturnType<typeof UnshiftChat.action>) => {
      const { chat, addToList } = payload;

      draft.chats[chat.id] = merge(draft.chats[chat.id], chat);

      const chatFromStore = draft.chats[chat.id];

      if (chatFromStore) {
        chatFromStore.isGeneratedLocally = false;
      }

      if (addToList) {
        draft.chatList.chatIds.unshift(chat.id);
      }

      return draft;
    };
  }
}
