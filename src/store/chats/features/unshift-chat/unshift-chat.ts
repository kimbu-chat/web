import produce from 'immer';
import merge from 'lodash/merge';
import { createAction } from 'typesafe-actions';
import { IChatsState } from '../../chats-state';
import { IUnshiftChatActionPayload } from './action-payloads/unshift-chat-action-payload';

export class UnshiftChat {
  static get action() {
    return createAction('UNSHIFT_CHAT')<IUnshiftChatActionPayload>();
  }

  static get reducer() {
    return produce((draft: IChatsState, { payload }: ReturnType<typeof UnshiftChat.action>) => {
      const { chat, addToList } = payload;

      merge(draft.chats[chat.id], chat);

      const chatFromStore = draft.chats[chat.id];

      if (chatFromStore) {
        chatFromStore.isGeneratedLocally = false;
      }

      if (addToList) {
        draft.chatList.chatIds.unshift(chat.id);
      }

      return draft;
    });
  }
}
