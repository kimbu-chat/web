import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { IChatsState } from '../../chats-state';
import { IUnshiftChatActionPayload } from './action-payloads/unshift-chat-action-payload';

export class UnshiftChat {
  static get action() {
    return createAction('UNSHIFT_CHAT')<IUnshiftChatActionPayload>();
  }

  static get reducer() {
    return produce((draft: IChatsState, { payload }: ReturnType<typeof UnshiftChat.action>) => {
      const { chat } = payload;

      if (!draft.chats[chat.id]) {
        draft.chatList.chatIds.unshift(chat.id);
        draft.chats[chat.id] = chat;
      }

      if (!draft.messages[chat.id]) {
        draft.messages[chat.id] = {
          messages: [],
          messageIds: [],
          hasMore: true,
          loading: false,
        };
      }

      return draft;
    });
  }
}
