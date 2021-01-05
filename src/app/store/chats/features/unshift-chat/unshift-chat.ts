import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { IUnshiftChatActionPayload } from './action-payloads/unshift-chat-action-payload';
import { IChatsState } from '../../models';

export class UnshiftChat {
  static get action() {
    return createAction('UNSHIFT_CHAT')<IUnshiftChatActionPayload>();
  }

  static get reducer() {
    return produce((draft: IChatsState, { payload }: ReturnType<typeof UnshiftChat.action>) => {
      draft.chats.unshift(payload);

      return draft;
    });
  }
}
