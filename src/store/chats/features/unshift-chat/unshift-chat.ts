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
      draft.chats.chats.unshift(payload);

      if (!draft.messages[payload.id]) {
        draft.messages[payload.id] = {
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
