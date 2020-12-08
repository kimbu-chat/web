import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { UnshiftChatActionPayload } from './unshift-chat-action-payload';
import { ChatsState } from '../../models';

export class UnshiftChat {
  static get action() {
    return createAction('UNSHIFT_CHAT')<UnshiftChatActionPayload>();
  }

  static get reducer() {
    return produce((draft: ChatsState, { payload }: ReturnType<typeof UnshiftChat.action>) => {
      draft.chats.unshift(payload);

      return draft;
    });
  }
}
