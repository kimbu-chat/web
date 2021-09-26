import produce from 'immer';
import { createAction } from 'typesafe-actions';

import { IChatsState } from '../../chats-state';

export class GetMessagesFailure {
  static get action() {
    return createAction('GET_MESSAGES_FAILURE')<number>();
  }

  static get reducer() {
    return produce(
      (draft: IChatsState, { payload }: ReturnType<typeof GetMessagesFailure.action>) => {
        const chatId = payload;

        const chatMessages = draft.chats[chatId]?.messages;

        if (chatMessages) {
          chatMessages.loading = false;
        }

        return draft;
      },
    );
  }
}
