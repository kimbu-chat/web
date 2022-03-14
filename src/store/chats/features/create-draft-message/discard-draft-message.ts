import produce from 'immer';
import { createAction } from 'typesafe-actions';

import { IChatsState } from '../../chats-state';


export class DiscardDraftMessage {
  static get action() {
    return createAction('DISCARD_DRAFT_MESSAGE')<number>();
  }

  static get reducer() {
    return produce(
      (draft: IChatsState, { payload: chatId }: ReturnType<typeof DiscardDraftMessage.action>) => {
        const chat = draft.chats[chatId];
        chat.draftMessageId = undefined;

        return draft;
      },
    );
  }
}
